// SaveVaultPlugin — Grimmwick's save lifeboat (Capacitor 8, iOS 14+)
// Registered in MyViewController.capacitorDidLoad(). JS side: Capacitor.Plugins.SaveVault
// Every save write lands in BOTH UserDefaults (survives app updates) and iCloud key-value
// storage (survives app deletion and follows the player's iCloud account to new devices).
// The JS Store wrapper keeps localStorage as the live copy; the vault restores into EMPTY
// installs only — so same-device play never fights the cloud, and a delete/reinstall or a
// brand-new iPhone quietly gets the save back before the title screen.
//
// CLOUD-CHANGE OBSERVER (audit-hardened): on a fresh device the iCloud download often finishes
// AFTER the one boot-time get() — the didChangeExternally notification catches that late arrival
// and hands the value to JS (retained until its listener attaches), where the same virgin-guarded
// adoption runs. The JS side also suppresses cloud writes for virgin saves, so a fresh boot can
// never overwrite a real cloud save while the first sync is still in flight.
// Master copy lives in native/ (ios/ is gitignored); installed copy: ios/App/App/SaveVaultPlugin.swift
import Foundation
import Capacitor

@objc(SaveVaultPlugin)
public class SaveVaultPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SaveVaultPlugin"
    public let jsName = "SaveVault"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
    ]
    static let saveKey = "grimmwick_save"   // the vault holds exactly one treasure

    public override func load() {
        let cloud = NSUbiquitousKeyValueStore.default
        NotificationCenter.default.addObserver(self, selector: #selector(cloudChanged(_:)),
            name: NSUbiquitousKeyValueStore.didChangeExternallyNotification, object: cloud)
        cloud.synchronize()   // registers for updates and kicks the initial iCloud download
    }
    deinit { NotificationCenter.default.removeObserver(self) }

    @objc private func cloudChanged(_ note: Notification) {
        guard let value = NSUbiquitousKeyValueStore.default.string(forKey: Self.saveKey) else { return }
        DispatchQueue.main.async { [weak self] in
            self?.notifyListeners("cloudChanged", data: ["value": value], retainUntilConsumed: true)
        }
    }

    @objc func get(_ call: CAPPluginCall) {
        let cloud = NSUbiquitousKeyValueStore.default
        cloud.synchronize()   // pull the freshest local iCloud cache before reading
        let key = call.getString("key") ?? Self.saveKey
        let iCloud = cloud.string(forKey: key)
        let local = UserDefaults.standard.string(forKey: key)
        // Prefer the iCloud copy: on a fresh reinstall UserDefaults is empty and iCloud is the
        // survivor; on the same install both are written together and identical.
        call.resolve(["value": (iCloud ?? local) as Any, "fromCloud": iCloud != nil])
    }

    @objc func set(_ call: CAPPluginCall) {
        guard let value = call.getString("value") else { call.reject("value required"); return }
        let key = call.getString("key") ?? Self.saveKey
        UserDefaults.standard.set(value, forKey: key)
        let cloud = NSUbiquitousKeyValueStore.default
        cloud.set(value, forKey: key)
        cloud.synchronize()   // schedules the upload; the system coalesces and rate-limits it
        call.resolve()
    }
}
