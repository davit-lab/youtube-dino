# Repeating zombie respawns

`zombie-respawns.js` schedules each killed zombie once and restores it after 3,000 milliseconds of active gameplay. Native zombies return to their original spawn coordinates with the same appearance, elite status and full health. Stage zombies return through the existing emergence animation and can be killed and respawn indefinitely.

The scheduler advances through `updateZombies`, not `setTimeout`. Pause, hidden tabs and player death/falling freeze pending time. Level loads and checkpoint enemy resets clear pending entries. Stage spawn activation cannot bypass a pending countdown. Existing stage caps and geometry safety checks can defer a ready respawn until there is room. Completed seal/boss encounters cancel their pending reinforcements so campaign progression remains possible. Flappy Flight and Snake Dino receive no zombies.

Changed: `index.html`, `temp_script.js`, `stage-zombies.js`. Added: `zombie-respawns.js`, `tests/zombie-respawns.cjs`.

Browser checks verify four consecutive kill/respawn cycles for both native and stage enemies; no respawn at 2,999ms and respawn at 3,000ms; full health and original coordinates; deduplication; paused/hidden time; level/checkpoint cleanup; active-cap deferral; completed encounter cleanup; and no leakage into Levels 21–22. Existing stagecraft browser and Georgian/combat checks also pass.
