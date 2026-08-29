# Night Board setup — App Store Connect (owner task, ~5 minutes)

The game code + native Game Center bridge are DONE. Scores submit automatically once these
TWO leaderboards exist in App Store Connect. Do this any time before the 1.1 release.

## 1. Create the 2 leaderboards

App Store Connect → **Apps → Grimmwick** → sidebar **GROWTH & MARKETING → Game Center** → Leaderboards → **＋**

Create **Classic** (not recurring) leaderboards — the **ID must match EXACTLY**:

| Leaderboard ID | Reference name | Format | Sort |
|---|---|---|---|
| `grimmwick.flawless` | Flawless Night | Integer | **Low to High** |
| `grimmwick.night` | The Night | Integer | **Low to High** |

Notes:
- Score Range: leave defaults. Localization: add English, score format "Integer".
- Scores are a composite integer (time → deaths → damage → candy packed together) — the game
  decodes and displays the full stat line itself; Apple's own display formatting barely matters.
- The per-entry star count travels in Game Center's "context" field automatically.

## 2. Enable Game Center on the next version

When 1.1 is created in ASC: version page → **Game Center** section → toggle ON → add both
leaderboards to the version. (They go live with the version release.)

## 3. Nothing else

- The Xcode project already has the Game Center entitlement + the native plugin.
- No accounts to build: Apple manages identity. Players sign into Game Center once (iOS prompts).
- Keep the 4+ rating WITHOUT the Made-for-Kids category (kids category would disable Game Center).

## How the boards work (reference)

- **🏆 FLAWLESS NIGHT** — the mastery board. Entry requires finishing the game with **all 75 stars**
  (3 per level × 25 levels). Your score is the total play-clock from New Game to the moment the last
  requirement lands. Cozy Mode anywhere in the save disqualifies it (records integrity).
- **🌙 THE NIGHT** — everyone who beats the game. Ranked by whole-night time; ties broken by fewest
  deaths, then least damage, then most candy. Each row shows: time · ⭐ stars · 🍬 candy · 💜 damage · ☠️ deaths.
- Composite: `timeCS*1e9 + min(deaths,99)*1e7 + min(damage,999)*1e4 + (9999-min(candy,9999))`, lower is
  better; stars ride the Game Center context field. Saves migrated from v1.0 show "—" for damage/deaths
  (their counters started mid-story) and take worst-case tiebreaks — their times stay honest.
