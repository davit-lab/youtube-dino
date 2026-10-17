# Zombie pursuit and attack fix

Stage enemies were clamped to each small spawn platform's patrol limits during both pursuit and lunges. On narrow stair tiles the allowed travel could be only a few pixels, leaving the player out of reach. Ordinary zombies also treated individual platform edges as cliffs even where an adjacent platform continued the path.

`zombie-navigation.js` advances grounded enemies across connected supporting platforms, including stair rises up to 48px and drops up to 64px. Grounded pursuit stops at unsupported gaps, closed doors and solid walls. Stage pursuit/lunge destinations can leave the tiny home patrol range. Windborne enemies choose a supported landing and retain their jump animation. Ready/channeling stage enemies in direct contact now attack rather than remaining harmless. Emergence and recovery windows remain, and invulnerability does not interrupt the transition out of a lunge.

Changed: `index.html`, `stage-zombies.js`, `temp_script.js`. Added: `zombie-navigation.js`, `tests/zombie-attacks.cjs`.

Chromium checks confirm all six stage variants leave a deliberately tiny patrol and actually damage the player; native zombies cross platform seams and initiate their bite; stairs are traversable; ground pursuit stops at gaps and walls. The existing stagecraft browser suite and repeating three-second respawn suite pass. Syntax/whitespace checks pass. No manual campaign playthrough is claimed.
