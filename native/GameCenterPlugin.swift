// GameCenterPlugin — Grimmwick's Night Board bridge (Capacitor 8, iOS 14+)
// Registered in MyViewController.capacitorDidLoad(). JS side: Capacitor.Plugins.GameCenter
// Master copy lives in native/ (ios/ is gitignored); installed copy: ios/App/App/GameCenterPlugin.swift
import Foundation
import Capacitor
import GameKit

@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "signIn", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "submit", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadBoard", returnType: CAPPluginReturnPromise),
    ]

    @objc func signIn(_ call: CAPPluginCall) {
        let player = GKLocalPlayer.local
        if player.isAuthenticated {
            DispatchQueue.main.async { GKAccessPoint.shared.isActive = false }  // UIKit-adjacent — main thread only
            call.resolve(["authenticated": true, "alias": player.alias])
            return
        }
        var responded = false
        player.authenticateHandler = { [weak self] viewController, error in
            DispatchQueue.main.async {
                if let vc = viewController {
                    self?.bridge?.viewController?.present(vc, animated: true)
                    return  // the handler fires again once the sheet is dismissed
                }
                GKAccessPoint.shared.isActive = false  // the Night Board is our own UI — hide Apple's floating badge
                if !responded {
                    responded = true
                    call.resolve(["authenticated": player.isAuthenticated, "alias": player.alias])
                }
            }
        }
    }

    @objc func submit(_ call: CAPPluginCall) {
        guard let board = call.getString("board") else { call.reject("board required"); return }
        guard GKLocalPlayer.local.isAuthenticated else { call.reject("not authenticated"); return }
        let value = call.getInt("value") ?? 0
        GKLeaderboard.submitScore(value, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [board]) { error in
            if let e = error { call.reject(e.localizedDescription) } else { call.resolve() }
        }
    }

    @objc func loadBoard(_ call: CAPPluginCall) {
        guard let board = call.getString("board") else { call.reject("board required"); return }
        guard GKLocalPlayer.local.isAuthenticated else { call.reject("not authenticated"); return }
        let friends = call.getBool("friends") ?? false
        let count = max(1, min(call.getInt("count") ?? 25, 50))  // NSRange length must be positive
        GKLeaderboard.loadLeaderboards(IDs: [board]) { boards, error in
            if error != nil {
                call.resolve(["entries": [], "total": 0, "error": true])  // network/GC failure ≠ empty board — the UI tells them apart
                return
            }
            guard let lb = boards?.first else {
                call.resolve(["entries": [], "total": 0])
                return
            }
            lb.loadEntries(for: friends ? .friendsOnly : .global,
                           timeScope: .allTime,
                           range: NSRange(location: 1, length: count)) { localEntry, entries, total, error in
                let meID = GKLocalPlayer.local.gamePlayerID
                var rows: [[String: Any]] = []
                for e in entries ?? [] {
                    rows.append([
                        "rank": e.rank,
                        "name": e.player.alias,
                        "value": e.score,
                        "me": e.player.gamePlayerID == meID,
                    ])
                }
                var result: [String: Any] = ["entries": rows, "total": total]
                if let l = localEntry, l.rank > 0 {
                    result["localRank"] = l.rank
                    result["localValue"] = l.score
                }
                call.resolve(result)
            }
        }
    }
}
