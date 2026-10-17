# Level 22 — Snake Dino

## Entry and files

Complete Flappy Flight's 50 pipes to unlock Level 22, return to campaign selection, then select tile 22. Previously saved Level 21 completion also unlocks it on load. There is no Level 23.

- `snake-dino.js`: scoped scene, grid simulation, body art, input and state lifecycle.
- `temp_script.js`: registration, shared loop dispatch, loading, save integration and migration.
- `flappy-flight.js`: unlock Level 22 immediately when Level 21 completes.
- `index.html`: scene script and scoped responsive canvas rules.
- `tests/snake-dino.cjs`: browser checks. `tests/flappy-flight.cjs` now expects 22 registered levels and accepts an already-unlocked later level.
- `assets/snake-dino-level-22-assets/`: supplied characters, head crops, manifest, readme and original sheet. No supplied art was repainted. Straight, corner and tapered tail pieces are drawn with canvas rectangles in matching purple/cyan/navy; these tiles were not part of the supplied assets.

## Simulation and pacing

The logical scene is 600×760, with a fixed 24×20 board of 22px cells. The full arena and D-pad scale together without changing grid coordinates. Head art uses a constant 30px canvas draw, yielding approximately 24px visible content according to the manifest. Full art uses the original aspect ratio with a fixed centered pivot. Image smoothing is disabled.

Start with five segments facing right, near the center, and first food five cells ahead. Each food grows once and awards 10 points. Completion is based on 40 foods, not score. Speed: 150ms/cell for foods 0–9, 135ms for 10–24, 120ms for 25–39. Endless decreases by .6ms per food down to 95ms. Values and objective are centralized in `SnakeDino.config`.

Food selection enumerates free cells, preferring Manhattan distances 16–24 from the head when available, otherwise any free cell. This gives substantial travel without time gates (roughly 100–120 seconds of direct travel at campaign speeds; actual human run length varies). No random retry loop is used. A full board completes successfully.

The queue holds at most two turns, validates against the last queued direction, and consumes one per tick. Occupancy updates remove a vacating tail before adding the next head; entering a tail that remains due to growth is fatal. Movement uses a bounded accumulator with at most two moves per frame. Pause, resize, blur and hidden tabs clear pending turns and time accumulation.

## Controls and lifecycle

Arrow keys/WASD turn; Enter/Space/tap starts. Swipe at least 18 logical pixels, or use the 72px logical D-pad buttons (about 46 CSS pixels at a 390px-wide viewport). P/Escape or the separate pause control pauses. Pause offers resume/replay/exit. No input listeners or timers are installed per attempt.

Collision stops movement and scoring, shows the supplied hit pose for 180ms, then the supplied single dead pose; results appear after 850ms. Replay has a short guard. Reduced-motion preferences suppress shake/particles. Existing `beep` audio honors SFX volume; pause suspends the existing audio context and resume/replay restores it.

Completion saves immediately and freezes the board. Continue Endless preserves body coordinates, direction, length, food and score, clears buffered turns, and waits in READY for explicit resume. Board-full success offers replay rather than an impossible endless continuation. Completion remains saved after endless death.

Records use existing save/load functions and `geodino_snake22`: completion, campaign best, endless best and best length. Completion also awards campaign stars and existing level-win quest progress.

## Verification

Run `PLAYWRIGHT_MODULE=/path/to/playwright node tests/snake-dino.cjs`. Checks cover buffering, reversal rejection, tail rules, free-cell food, exact growth/scoring, 30/60/144fps movement, pause, hidden-tab handling, completion, preserved endless state, board-full success, repeated entry, keyboard repeat, selection, saves/migration and earlier-level rendering. Chromium mobile emulation checks fixed framing, tap/D-pad/swipe and blur pause. Screenshots: `artifacts/snake-dino-*.png`.

The Flappy Flight browser suite and Levels 15–20 physics suite pass. The older stagecraft browser suite retains its previously observed `checkpointsStillSupported` failure, unrelated to this scene. Syntax checks and `git diff --check` pass.

No physical phone testing or manual full-length campaign playtest was performed. Human review of pacing, sound and input feel remains useful; the projected run duration is not a measured human completion time.
