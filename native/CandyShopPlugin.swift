// CandyShopPlugin — Grimmwick's Candy Shop (StoreKit 2, iOS 15+)
// The ONLY real-money surface in the game: three consumable candy packs. Money buys patience, nothing else.
// Registered in MyViewController.capacitorDidLoad(). JS side: Capacitor.Plugins.CandyShop
//
// TWO-PHASE GRANT (audit-hardened): a paid pack must NEVER be lost, so the transaction is NOT
// finished when the 'grant' event fires — it waits in `pending` until JS has added the candy AND
// persisted the save, then calls confirm(txid), and only then does finish() run. Anything unconfirmed
// (process death, webview reload, suspended JS) re-delivers on the next launch via Transaction.unfinished,
// and the JS txid dedupe absorbs repeats: a grant can be repeated, never lost.
// Ask to Buy (4+ game): a kid taps Buy, a parent approves later — the approval arrives through
// Transaction.updates whenever it happens and flows through the same one grant path.
// Master copy lives in native/ (ios/ is gitignored); installed copy: ios/App/App/CandyShopPlugin.swift
import Foundation
import Capacitor
import StoreKit

@objc(CandyShopPlugin)
public class CandyShopPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CandyShopPlugin"
    public let jsName = "CandyShop"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getProducts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "buy", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "confirm", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "replay", returnType: CAPPluginReturnPromise),
    ]

    // Product IDs ↔ candy amounts. Must match the consumables configured in App Store Connect.
    static let candyForProduct: [String: Int] = [
        "grimmwick.candy.handful": 1200,   // $0.99
        "grimmwick.candy.bucket":  4000,   // $2.99
        "grimmwick.candy.cauldron": 7500,  // $4.99
    ]
    private var updatesTask: Task<Void, Never>? = nil
    private var pending: [String: Transaction] = [:]   // notified, awaiting JS confirm — guarded by pendingLock
    private let pendingLock = NSLock()
    // synchronous lock helpers: NSLock across async suspension points is illegal in Swift 6 —
    // these never suspend, so calling them FROM async contexts is safe and warning-free
    private func stashPending(_ txid: String, _ t: Transaction) {
        pendingLock.lock(); pending[txid] = t; pendingLock.unlock()
    }
    private func takePending(_ txid: String) -> Transaction? {
        pendingLock.lock(); defer { pendingLock.unlock() }
        return pending.removeValue(forKey: txid)
    }
    private var buying = false                          // one purchase sheet at a time

    public override func load() {
        // Lifelong listener: Ask-to-Buy approvals, purchases finishing from other devices, refunds.
        updatesTask = Task { [weak self] in
            for await result in Transaction.updates {
                _ = await self?.handle(result)
            }
        }
        // Paid-but-never-confirmed transactions re-deliver here on every launch.
        Task { [weak self] in
            for await result in Transaction.unfinished {
                _ = await self?.handle(result)
            }
        }
    }
    deinit { updatesTask?.cancel() }

    // The one grant path. Returns the outcome so buy() can report honestly.
    private func handle(_ result: VerificationResult<Transaction>) async -> String {
        guard case .verified(let t) = result else { return "unverified" }   // stays unfinished — retries next launch
        if t.revocationDate != nil { await t.finish(); return "revoked" }   // refunded — nothing to grant
        // UNKNOWN product = a NEWER pack this binary predates (App Store Connect grows, old app installed):
        // leave it UNFINISHED so an updated binary that knows the SKU grants it later. Finishing here would
        // destroy a paid purchase forever (audit fix).
        guard let candy = Self.candyForProduct[t.productID] else { return "unknown" }
        let txid = String(t.id)
        stashPending(txid, t)
        // main-queue hop serializes delivery against listener registration; retainUntilConsumed holds
        // launch-time grants until the game's JS attaches its listener.
        DispatchQueue.main.async { [weak self] in
            self?.notifyListeners("grant", data: ["productId": t.productID, "candy": candy, "txid": txid], retainUntilConsumed: true)
        }
        return "granted"
    }

    // JS calls this AFTER the candy is added and the save persisted — only now is the sale complete.
    @objc func confirm(_ call: CAPPluginCall) {
        guard let txid = call.getString("txid") else { call.reject("txid required"); return }
        if let t = takePending(txid) {
            Task { await t.finish(); call.resolve() }
        } else {
            call.resolve()   // already confirmed (re-delivered duplicate) — nothing to do
        }
    }

    // Re-offers every notified-but-unconfirmed grant. JS calls this once per page boot: the pending map
    // survives webview reloads (plugin instances outlive page lives), but a retained event consumed by a
    // dying page (the vault-restore reload) would otherwise wait for full process death to re-deliver.
    @objc func replay(_ call: CAPPluginCall) {
        pendingLock.lock(); let snapshot = pending; pendingLock.unlock()
        for (txid, t) in snapshot {
            guard let candy = Self.candyForProduct[t.productID] else { continue }
            DispatchQueue.main.async { [weak self] in
                self?.notifyListeners("grant", data: ["productId": t.productID, "candy": candy, "txid": txid], retainUntilConsumed: true)
            }
        }
        call.resolve(["count": snapshot.count])
    }

    @objc func getProducts(_ call: CAPPluginCall) {
        Task {
            do {
                let products = try await Product.products(for: Array(Self.candyForProduct.keys))
                let rows = products.sorted { $0.price < $1.price }.map { p -> [String: Any] in
                    ["id": p.id, "title": p.displayName, "price": p.displayPrice,
                     "candy": Self.candyForProduct[p.id] ?? 0]
                }
                call.resolve(["products": rows])
            } catch {
                call.reject("store unreachable: \(error.localizedDescription)")
            }
        }
    }

    @objc func buy(_ call: CAPPluginCall) {
        guard let id = call.getString("id"), Self.candyForProduct[id] != nil else { call.reject("unknown product"); return }
        if buying { call.resolve(["state": "busy"]); return }   // mash guard — one sheet at a time
        buying = true
        Task {
            defer { DispatchQueue.main.async { [weak self] in self?.buying = false } }
            do {
                guard let product = try await Product.products(for: [id]).first else {
                    call.reject("product not found"); return
                }
                let result = try await product.purchase()
                switch result {
                case .success(let verification):
                    let outcome = await handle(verification)
                    call.resolve(["state": outcome])   // granted | unverified | revoked | unknown
                case .pending:
                    call.resolve(["state": "pending"]) // Ask to Buy — grant arrives via updates when approved
                case .userCancelled:
                    call.resolve(["state": "cancelled"])
                @unknown default:
                    call.resolve(["state": "cancelled"])
                }
            } catch {
                call.reject("purchase failed: \(error.localizedDescription)")
            }
        }
    }
}
