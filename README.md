# 🎃 Grimmwick — Relight the Night

A cute-spooky 3D platformer for iPhone, iPad, and Mac. Free game + cosmetic store (costumes, characters, Spook Pass). First title in a re-themeable franchise.

**v0.1 playable slice**: Grimmwick hub town → World 1 "Pumpkin Patch" → Boss: The Pumpkin King. Four enemy types, six costumes, hidden Golden Pumpkins, checkpoints, full store UI (test mode), save system.

## Play it right now

Open `dist/grimmwick.html` in any browser (double-click it). That single file is the whole game.

| | Desktop (Mac) | iPhone / iPad |
|---|---|---|
| Move | WASD / arrows | left-side virtual joystick |
| Jump / double jump | Space (tap twice) | JUMP button (tap twice) |
| Spin attack | J | SPIN button |
| Ground pound | K (in air) | 💥 button (in air) |
| Interact | E | tap the orange prompt |
| Camera | drag mouse | drag right side of screen |

Tip: ground-pound a giant pumpkin for a mega-bounce. Stare at Boos to freeze them.

## Continue development with Claude Code

```bash
cd hollowville
npm install
claude
```

`CLAUDE.md` gives Claude Code the full architecture, story canon, conventions, roadmap (Worlds 2–5, IAP, App Store wrap), and test workflow. Suggested first prompts:

- "Playtest feedback: [what felt off]. Tune it."
- "Build World 2: Spider Woods, following the roadmap in CLAUDE.md."
- "Wrap the game with Capacitor and walk me through the Xcode submission."

## Ship to the App Store

See the "App Store wrap" section in `CLAUDE.md` — Capacitor generates an Xcode project; from there it's the same sign → archive → upload flow as your previous app. One build covers iPhone + iPad, with a checkbox for Mac.
