# Grimmwick — App Store listing kit (v1.0, free, no IAP)

Everything below is paste-ready for App Store Connect. Fields marked ✂️ have hard length limits.

---

## App name (30 chars max) ✂️
```
Grimmwick
```

## Subtitle (30 chars max) ✂️
```
Relight the Night
```

## Promotional text (170 chars max, editable without review) ✂️
```
The town where Halloween never ends has gone dark. Only Pip is small enough to slip past the shadows. 25 levels, 5 bosses, one festival to save. Free — no ads, ever.
```

## Description (4000 chars max)
```
🎃 GRIMMWICK — RELIGHT THE NIGHT

Welcome to Grimmwick, the town where Halloween never ends. Every hundred years the Ember Moon recharges the Everflame — the great bonfire that keeps every ghost friendly and every candy sweet. But tonight, a jealous shadow named Grimm swallowed the flame and shattered it into five embers, corrupting the beloved guardians who found them.

Everyone always says Pip is too small for adventures.
Everyone is about to be wrong.

⭐ A REAL ADVENTURE, COMPLETELY FREE
• 25 handcrafted levels across 5 districts — moonlit pumpkin farms, a spooky cemetery that descends into glowing catacombs, a haunted witchwood, a pirate galleon beached in a dried-up harbor, and a clockwork castle where every clock stopped at midnight
• 5 boss guardians, each with its own fight — and each with a secret takedown for clever players to discover
• A wholesome ending: the final blow of the game is not an attack

🕹️ FEELS LIKE THE CLASSICS
Run, double-jump, ground-pound, mega-bounce, and climb through levels built the way you remember: one idea introduced, twisted, and mastered; secret exits; high roads and low roads; hidden warps for speedrunners. Every level plays identically every time — die, learn, triumph.

🍬 CANDY IS EVERYTHING
Bonk enemies, collect candy, and spend it in the Costume Cauldron: costumes for Pip, permanent Level Ups like extra hearts and a candy magnet — every upgrade earnable by playing. Earn stars in each level (fast · all-candy · no-damage) to unlock free level-up rewards.

🧸 MADE FOR EVERY PLAYER
• Cozy Mode: extra hearts and gentler enemies, one toggle away — perfect for younger adventurers
• No ads. No purchases. No accounts. No data collected. Just the game.
• Play in portrait or landscape; full controller support

🎃 3 hidden Golden Pumpkins per district
⭐ 75 stars to hunt for perfectionists
👻 A town full of secrets — including two legendary leaps only the brave will find

The night is dark. The lanterns are waiting. Grab your candy bag, little hero.
```

## Keywords (100 chars max, comma-separated, no spaces needed) ✂️
```
platformer,halloween,spooky,cute,kids,jump,adventure,pumpkin,ghost,candy,mario-like,offline,no ads
```

## Category
- Primary: **Games → Action** (subcategory Platformer if offered)
- Secondary: **Games → Adventure**

## Age rating questionnaire answers
- Cartoon/fantasy violence: **Infrequent/Mild** (bonking cartoon ghosts)
- Everything else (realistic violence, profanity, horror themes, gambling, etc.): **None**
  - Note: the coffin/chest "gamble" is a surprise-box mechanic with no wagering and no real money — answer **None** for simulated gambling.
- Result: **4+**
- Do **NOT** enroll in "Made for Kids" (keeps Game Center possible later).

## Privacy section (App Privacy)
- **Data Not Collected** — the app has no analytics, no ads, no tracking, no accounts, no network calls. Save data lives only on the device.

## URLs
- Privacy Policy URL: host `docs/privacy.html` anywhere public (GitHub Pages is free — Settings → Pages on the repo, then the URL is `https://<user>.github.io/<repo>/privacy.html`)
- Support URL: the same page works (it includes a contact line).

## App Review notes (paste into the Review Notes field)
```
Grimmwick is a fully offline single-player platformer. No account, no login,
no purchases, no ads, no data collection. All content is available from the
first launch; progress gates are gameplay-based (beat a boss to open the next
district). The in-game "candy" store uses only candy earned by playing —
there is no real-money purchasing anywhere in the app.
```

## Screenshot plan (6.9" iPhone required; reuse for 6.5")
Take these in landscape on the iPhone 16 Pro simulator (⌘S saves a properly-sized PNG):
1. Title orbit over the festival town (string lights in frame)
2. Level 1-1 mid-jump over pumpkins (shows the hero + HUD)
3. The Ravenmoor catacombs (glowing crystals — shows range)
4. Boarding the Salty Phantom (cannon-launch moment)
5. Broomhilda boss fight (boss bar visible)
6. The finale's "THE EVERFLAME BURNS WHOLE AGAIN" banner moment
iPad set: same shots on the iPad Pro 13" simulator.

## Build & submit checklist
1. Enroll Apple Developer (individual = fastest; seller shows your name)
2. In Xcode: Signing → select your team on the App target (Release config)
3. App Store Connect → New App → bundle id `com.nolandurkin.grimmwick`, name **Grimmwick**
4. Xcode: Product → Archive → Distribute → App Store Connect → Upload
5. TestFlight it on your own phone first (one build, sanity pass)
6. Fill the listing with the copy above + screenshots → Submit for Review
```
