# Night Board setup — App Store Connect (owner tasks, ~15 minutes)

The game code + native Game Center bridge are DONE. Scores submit automatically once these
leaderboards exist in App Store Connect. Do this any time before the 1.1 release.

## 1. Create the 8 leaderboards

App Store Connect → **Apps → Grimmwick** → sidebar **GROWTH & MARKETING → Game Center** → Leaderboards → **＋**

Create **Classic** (not recurring) leaderboards, one per row — the **ID must match EXACTLY**:

| Leaderboard ID | Reference name | Format | Sort |
|---|---|---|---|
| `grimmwick.fastestnight` | Fastest Night | Integer | **Low to High** |
| `grimmwick.purenight` | Pure Night | Integer | **Low to High** |
| `grimmwick.candyhoard` | Candy Hoard | Integer | **High to Low** |
| `grimmwick.w1.night` | District 1 — Pumpkin Patch | Integer | **Low to High** |
| `grimmwick.w2.night` | District 2 — Ravenmoor | Integer | **Low to High** |
| `grimmwick.w3.night` | District 3 — Witchwood | Integer | **Low to High** |
| `grimmwick.w4.night` | District 4 — Ghost Harbor | Integer | **Low to High** |
| `grimmwick.w5.night` | District 5 — Cursed Castle | Integer | **Low to High** |

Notes per board:
- Score Range: leave defaults (or min 0, max blank). Localization: add English with score format "Integer".
- The game formats scores itself in the Night Board — Apple's display formatting barely matters.
- `fastestnight` scores are a composite (time·damage·candy in one integer) — that's intentional, per the tiebreaker spec.

## 2. Enable Game Center on the next version

When 1.1 is created in ASC: version page → **Game Center** section → toggle ON → add these 8
leaderboards to the version. (They go live with the version release.)

## 3. Nothing else

- The Xcode project already has the Game Center entitlement + the native plugin (auto-signing handles the capability).
- No accounts to build, no backend: Apple manages identity. Players sign into Game Center once (iOS prompts them); the game's 🏮 Night Board does the rest.
- Cozy Mode runs never submit. Scores queue offline and flush after sign-in.
- Keep the 4+ rating WITHOUT the Made-for-Kids category (kids category would disable Game Center).

## How scores work (reference)

- **Fastest Night** — whole-game clock (New Game → inviting Grimm), captured at first completion.
  Composite int: `timeCS*1e7 + min(damage,999)*1e4 + (9999 - min(candy,9999))` — lower is better;
  ties break by least damage taken, then most candy collected.
- **Pure Night** — same run, submitted only if damage taken was ZERO. Score = time in centiseconds.
- **Candy Hoard** — lifetime candy collected (spending doesn't subtract). Higher is better.
- **District boards** — sum of your best time in each of the district's 5 levels + the boss best, in centiseconds. Submits whenever a best improves and all 6 pieces exist.
