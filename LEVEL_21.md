# Level 21 — Flappy Flight

Enter through campaign Continue after beating Level 20, or select tile 21 after it unlocks. Level 20's existing completion flow saves the unlock and enters Level 21. No Level 22 is registered.

Implementation: `flappy-flight.js`, integrated by `temp_script.js`, `interface.js`, and `index.html`. Supplied art and manifest: `assets/flappy-level-21-assets/`. Sprites retain a common 320px pivot and .175 scale (idle content approximately 35×47 logical pixels). Transparent padding never participates in collisions. No additional animation loop or per-entry event handlers are created.

Controls: fresh Space, Up, W, pointer click or tap flaps. P/Escape or the pause button pauses. Resume preserves velocity. Pause menu offers replay and campaign return. Resize, window blur, and hidden tab pause the attempt. Flight physics ignore the global relaxed/turbo modifiers.

Configuration is in `FlappyFlight.config`: 360×640 viewport, ground at 570, gravity 1100 px/s², flap −330 px/s, terminal fall 600 px/s, pipes 62px with 70px caps, spacing 240px, initial scroll 124 px/s, gap 178px, target 50, fixed 120Hz steps with bounded frame accumulation. Gap centers stay between 160 and 410, with changes capped at 85px. Speed rises smoothly after pipe 15 to 138.88 px/s at 35; gaps narrow to 170px. Endless caps at 154.88 px/s and 158px gaps. Initial pipe begins at x390, giving over two seconds before contact. Automated successful flight takes approximately 93 seconds.

Records use the existing saveData/loadSavedData functions with the `geodino_flappy21` localStorage entry. Campaign best, endless best, completion and the best medal persist separately from attempt state. Completion also awards three campaign stars. Endless starts safely at rest in READY, preserving score and completion. Bronze/silver/gold thresholds are 10/25/50. Pause suspends the existing audio context; sound effects use the existing volume-aware beep system.

Validation:

- `node --check flappy-flight.js`, `temp_script.js`, `interface.js`.
- `PLAYWRIGHT_MODULE=/path/to/playwright node tests/flappy-flight.cjs`: registration, generator bounds, flap, frozen pause, cap collision, one score per pair, completion/save, safe endless, death animation lifecycle, repeated entry, keyboard repeat, full automated 50-pipe flight, Level 20 unlock, earlier-level rendering, and no browser errors.
- Existing `tests/stagecraft-physics.cjs` passes for Levels 15–20.
- Existing `tests/stagecraft-browser.cjs` passes all assertions except `checkpointsStillSupported`. The same assertion fails when Level 21 registration is disabled; checkpoint geometry was not changed by this feature. The test's campaign slice now explicitly ends at Level 20.
- Chromium mobile viewport/touch emulation: portrait framing verified at 390×844. Screenshots in `artifacts/flappy-*.png`.

Limitations: no physical phone or manual full-length playtest; sound quality and animation timing still benefit from human review. The existing checkpoint-placement test failure remains unresolved outside this feature's scope.
