// MyViewController — Capacitor 8 local-plugin registration point.
// Main.storyboard's view controller customClass points here (customModule="App").
// Master copy lives in native/ (ios/ is gitignored); installed copy: ios/App/App/MyViewController.swift
import UIKit
import Capacitor

class MyViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(GameCenterPlugin())
    }
}
