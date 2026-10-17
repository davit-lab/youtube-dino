# Distinct campaign trajectories, Levels 15–20

The repeated flat journey extensions have been replaced. Original first-half machinery, relics, treasure, temporary bridges, campaign saves and the final boss remain. The new route installer runs after the existing journey installer and removes its flat terrain, repeated notes/pumps/cart missions, coins and encounters inside the replacement region.

| Level | Route | Required task |
|---|---|---|
| 15 — Sunken Aqueduct | Stairs descend 320px into buried galleries, rise through a canopy 330px above the old floor, then return through the lower water gallery. | Recover three floodgate stones at different elevations. |
| 16 — Windward Summits | Open sky platforms rise 1,060px, turn left along a high switchback, then cross several descending and rising sky ridges. No repeated service tunnel. | Land at three summit flags. |
| 17 — Freight Rebellion | Drainage stairs descend 240px; a rooftop ascent reaches 600px above the street, reverses left, then returns through an armored vault. | Shoot three power relays. |
| 18 — Spiral Ore Shaft | Multi-level mine stairs descend 870px, reverse direction inside the shaft, cross a deep gallery and climb back out. | Defeat each marked mine foreman, then recover its ore cache. |
| 19 — Basalt Sky Forge | Sky parkour climbs 740px, descends into the cooling forge 300px below the old floor, then climbs back out. | Crouch beside three cooling wheels to turn them. |
| 20 — Lighthouse Switchback | Reversing lighthouse climb rises 980px, followed by a 220px sea-crypt descent and the preserved World Eater approach. | Ignite three ordered beacons before entering the existing boss fight. |

`trajectories.js` centralizes the six point sequences, mission modes, rooms and enemy species. Stairs use rises no greater than 40px per step; sky pads have 115px landing widths. Route arrows show horizontal/vertical direction changes. The native player collision system handles all surfaces. Tunnel roofs are omitted where they would intersect another floor's walking/jump clearance; they cannot wall off an upper switchback.

There are 21 / 21 / 24 / 29 / 31 / 31 authored zombie spawn positions across the six complete worlds (counts may change with future placement edits). Patrols use the actual route surface and floor height. More squads also appear in the original half where existing static support permits. Active caps are now 5 Easy / 7 Normal / 8 Hardcore. Far-away living patrols retire and may return when backtracking; kills remain credited and grouped seal/boss enemies remain under their original lifecycle. Checkpoint/goal recovery areas exclude ordinary spawn positions.

Mission progress survives checkpoint retries, resets on a full replay, and still controls the existing exit door/boss entry. Checkpoints lacking physical support now receive small static recovery ledges. This also resolves the previously failing checkpoint-support assertion.

Changed integration files: `endgame.js`, `journeys.js`, `stagecraft.js`, `stage-zombies.js`, `index.html`. New implementation: `trajectories.js`. New checks: `tests/trajectories.cjs`. The existing physics route search now tests leftward jumps as well as rightward jumps, so it can validate the new switchbacks.

Validation uses headless Chromium and the existing native physics:

- `tests/trajectories.cjs`: every adjacent authored route edge with complete expedition collision geometry, objective activation, actual foreman defeat credit, checkpoint preservation, replay reset, distinct heights/directions, and representative renders.
- `tests/stagecraft-browser.cjs`: existing machinery, combat, boss, rewards and earlier-level assertions.
- `tests/stagecraft-physics.cjs`: existing platform carrying, crossing recovery, route/reward reachability and respawn assertions.
- `tests/flappy-flight.cjs`, `tests/snake-dino.cjs`: later campaign regression checks.
- Syntax checks and `git diff --check`.

Screenshots: `artifacts/trajectory-aqueduct.png`, `trajectory-sky.png`, `trajectory-mine.png`, `trajectory-lighthouse.png`. No manual full campaign or physical-phone playtest is claimed. Edge checks can land on a higher neighboring stair when a normal jump skips a step; they establish local traversability, not a full automatic combat playthrough.

## Platform cleanup

Flat expedition stretches now use continuous slabs, and coincident landings/checkpoint supports merge into a single surface. Stair widths follow their spacing and their undersides stay clear of lower steps. Static ledges in the original sections are thinner where they intersect neighboring surfaces; moving machinery keeps its own geometry. Expedition terrain uses clean undersides instead of jagged extensions into adjacent steps. Browser assertions verify zero overlapping expedition slab rectangles across all six levels. Route, mission, checkpoint, machinery and physics checks pass after cleanup.
