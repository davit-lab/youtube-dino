> Route update: the repeated journey extensions have been replaced with six distinct expeditions. See [LEVELS_15_20_ROUTES.md](LEVELS_15_20_ROUTES.md) for current geometry, missions, enemy counts and checks.

# Levels 15–20: encounter upgrade

The existing map environments, named areas, world lengths, side-scrolling route,
checkpoints and collectibles remain the foundation. New machinery is authored
into those routes. Local platform edits create boarding points, dismounts and
lower recovery routes; conflicting old hazards are removed rather than stacked
under new ones.

## Playable additions

| Level | Mechanics | Zombie and encounter progression |
| --- | --- | --- |
| 15 · Lost Aqueduct | Weight-sensitive tilting stone slabs; pulsing waterfall curtains with catch platforms; sweeping vine snares with shootable anchors. | Rootbound zombies emerge, telegraph a lunge, then recover. Individual introductions precede the slab/water crossing around x8010–8470, with an enemy on stable ground. Logs and thorn roots have larger matching collision bounds. |
| 16 · Wind Archive | Four-platform rotating stone rings; giant bells emitting jumpable ground pulses; paired counterweight lifts. | Windborne zombies prepare a fixed jump between marked landings. Rings have clear boarding openings, lower recovery platforms and upper coin bags. Later bells and lifts develop the timing alongside existing wind and ice. |
| 17 · Last Train | Signaled freight-train crossings with upper escape decks; moving magnetic cargo containers that provide solid cover/platforms; power-routing switches with safe transition windows and a second relay. | Armored workers resist frontal body shots, expose their heads/backs and lower their armor during recovery. The loading dock combines its conveyor, a crane and a small mixed group. Later junctions and trains require route selection. |
| 18 · Hidden Mine | Rideable swinging ore buckets; staggered descending drills with marked safe pockets; crystal floors that crack, break and recover. | Burrowing miners show moving dust before emerging and cannot deal contact damage during emergence. The exit sequence places drills at x8370 and fracturing floors at x8820, with bounded miner pressure and a later bucket crossing. |
| 19 · Basalt Ridge | Cyclic lava-tide chambers with high-water markers; cooling slag platforms that soften and sink; valve-operated temporary steam bridges. | Cinder zombies telegraph charges and leave at most five short-lived burning footprints. Later tide/slag chambers combine timing with stable ledges, while valves can always be reused. |
| 20 · Lighthouse Guardian | Rotating beams that trigger marked receivers and floor hazards; rhythmic solid/inactive resonance platforms; two bounded seal-defense fights. | Guardians visibly protect nearby allies; shooting the guardian interrupts its channel. The final approach revisits a tilting slab and staggered drills. Both seals must be completed before entering the World Eater arena. |

There are 18 new mechanic types across 55 authored instances. New enemies share
the existing zombie array, weapon damage, animations and reward accounting;
silhouette additions distinguish helmets, roots, mining gear, scarves and staffs.

### Crossing and readability refinement

Each world now has a developed crossing: the aqueduct slab at x8010, archive
counterweights at x10300, freight crane at x3840, crystal floors at x7550, slag at
x4800, and resonance platforms at x4330. Redundant ground underneath is cut where
appropriate, while checkpoint islands and elevated landmarks remain. Two broad
lower ledges, an 80-pixel gap and an entry step make recovery playable. Each of
these crossings adds a ten-coin bag along its upper route.

Repeated machinery runs up to 14% faster than its introduction. Later crystal
and slag surfaces last up to 16% less time; difficulty settings still apply.
The middle stone ring reverses direction. Train signals show three countdown
ticks, steam decks show their remaining duration, and floor cracks spread as
their supporting surface weakens. Only the nearest machinery instruction is
shown, with its label kept within the screen. Airborne zombies are no longer
clipped at ground level while jumping.

## Controls and fairness

- Existing movement, jump, shooting and crouching controls are unchanged.
- Touch or shoot the marked power switches/steam valves. Shoot vine anchors to
  disable a snare temporarily. Landing on a lift or bucket makes it carry you.
- Typical enlarged jump obstacles are 42–48 pixels high against the player's
  54-pixel standing height. Crouching remains 24 pixels high, with clearance under
  crawl beams and active vine sweeps. Major structures have visible supports.
- Ring platforms are 108 pixels wide, counterweights 130, buckets 150, and cargo
  containers 156. Geometry and movement are used by both rendering and collision.
- Warnings use movement, dust, signals and ground marks; essential timing cues
  remain visible with sound muted.
- Enemy placement rejects the player's immediate area, checkpoint recovery
  areas, solid obstacles, closed doors, windmill blades and active new hazards.
  Distant machinery and wildlife skip updates; zombie counts are bounded.

| Setting | Warning multiplier | Machinery speed | Safe-window multiplier | Active zombie cap | Seal enemies per wave |
| --- | ---: | ---: | ---: | ---: | ---: |
| Easy | 1.45 | 0.80 | 1.30 | 5 | 1 |
| Normal | 1.20 | 1.00 | 1.10 | 7 | 2 |
| Hardcore | 1.00 | 1.08 | 0.90 | 8 | 3 |

Easy has one seal wave; Normal and Hardcore have two. Spawns remain subject to
safe placement and the global cap, so a wave can contain fewer enemies. Enemy HP
does not increase with difficulty.

## Rewards, retries and boss

Each level retains three relics and its chest. Checkpoint counts remain
4 / 4 / 5 / 4 / 4 / 4. The ten-second bonus bridges in Levels 15 and 17 retain
their activation, expiry and chest rewards. Local ring changes relocate the
affected bird delivery onto a permanent recovery platform.

Animal interactions remain functional: rabbits uncover five coins, birds deliver
three, a calm crouching player earns the deer's healing/shield, and the cave and
volcano lizards disable their respective spike trap/fan for twelve seconds.

Checkpoint damage resets new hazard clocks, projectiles, moving platforms,
incomplete seal encounters and nearby enemies. Completed seals and collected
rewards remain completed. Full level reloads reset the entire encounter. Enemy
damage has a cooldown, emergence is non-damaging, and corpses do not block paths.

The World Eater retains 1,200 HP, three phases, projectile volleys, ground waves
and later meteors. A new attack waits for existing projectiles to clear. Phase
changes clear attacks and give a repositioning break. Phases two and three can
each bring one reinforcement; the boss pauses its attacks during that bounded
reinforcement window. Boss death unlocks the existing finish, and checkpoint
retry restores the boss and clears reinforcements.

## Files

- `stagecraft.js`: configurations, reusable machinery, collision surfaces,
  drawing, difficulty tuning, interaction and reset logic.
- `stage-zombies.js`: six variants, spawn checks/caps, seal waves, boss
  reinforcement management and combat feedback.
- `endgame.js`: installs the encounters, integrates their update/render/reset
  hooks, and coordinates the boss's attacks and HUD.
- `temp_script.js`: active engine integration for platform carrying/collision,
  projectiles, zombie behavior, checkpoint resets and the arena entry condition.
- `index.html`: loads the new modules before the existing engine.
- `encounters.js` and `wildlife.js`: existing work in this workspace, retained and
  integrated alongside the new stage mechanics.
- `tests/stagecraft-browser.cjs`, `tests/stagecraft-physics.cjs`,
  `tests/stagecraft-live.cjs`: functional, physics and live-loop regression checks.

## Verification

Start the local server with `npm start`, then open `http://localhost:3000`.
The browser tests require Playwright and its Chromium browser. With Playwright
available in your environment:

```sh
node tests/stagecraft-browser.cjs
node tests/stagecraft-physics.cjs
node tests/stagecraft-live.cjs
```

If Playwright/Chromium are installed outside this repository, set
`PLAYWRIGHT_MODULE` to the Playwright module path and `CHROMIUM_PATH` to the browser
executable. `GAME_URL` can override the local server URL. No runtime dependency
was added to the game for testing.

Verified during implementation:

- 107 functional browser assertions: all mechanic types and zombie variants,
  moving platforms, switches, crouch clearance, hazard lifecycles, native bullet
  kills, spawn exclusions, seal completion on all three modes, checkpoint resets,
  boss transitions/reinforcement limits/defeat, bonus bridge timers and rewards,
  plus smoke checks for Levels 1, 6 and 14.
- Physics route graphs reach the finish geometry in all six levels using the
  actual `updatePlayer` jump without double-jump/high-jump upgrades. Optional
  rewards are within the jump envelope from reachable platforms. Moving ferry
  endpoints are included. Five new carrier types hold the player for 120/120
  frames through the normal player movement update.
- Eighteen recovery checks (six crossings in each difficulty) use the full
  player/hazard update with invulnerability disabled: normal jumps reach the
  recovery steps without damage. Checkpoint support and airborne enemy rendering
  also have regression coverage.
- Normal animation-loop smoke checks with keyboard movement/jumping in all six
  worlds: no browser exceptions, invalid coordinates or enemy-cap violations.
- Separate existing local animal and bonus-route regression scripts pass,
  including all six bonus-bridge jumps, reward amounts, lizard expiry, bat crouch
  safety and wildlife motion at 30/60/120 Hz. The old cargo fixture now skips
  cargo deliberately replaced by new machinery.
- Browser screenshots reviewed for the slab, ring, crane, drills, tide and beam;
  JavaScript syntax and whitespace checks pass.

Limitations: the route graph isolates movement from combat and hazard timing.
The live smoke test samples sections, with invulnerability, rather than playing
every level end-to-end. These are not full human playthroughs on all difficulty
modes, nor a low-end/mobile performance certification. Final difficulty feel
still benefits from playing the whole campaign.
