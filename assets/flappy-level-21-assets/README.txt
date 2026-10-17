FLAPPY FLIGHT — LEVEL 21 CHARACTER ASSETS

16 individual transparent RGBA PNG frames, each on a 320 x 320 pixel canvas.
The original generated sheet and a ready-to-paste Codex implementation prompt
are also included.

ANIMATIONS
idle_01–04: idle / hover
flap_01–04: upward flap / jump
glide_01: level flight
fall_01–02: downward flight
hit_01: collision reaction
death_01–04: stunned, tumbling, on-side, final defeated pose

USAGE
Extract this folder into your game's assets area or give the ZIP to Codex.
Paste CODEX-LEVEL-21-PROMPT.txt into Codex while your existing game is open.
animations.json contains frame paths, suggested timing, source cells,
and actual content bounds for sizing.

Visible sprites have different pose extents within equal transparent canvases.
Use a fixed center pivot and a consistent draw scale, then inspect animation
alignment in your engine. Avoid independently stretching each pose to fill a
rectangle. Keep collision bounds independent of wings and transparent padding.
The original sheet uses a generated pixel-art style; it is not a native
low-resolution pixel grid. Render with smoothing disabled at game scale.

Each original cell was cropped around visible content and centered, with no
resampling, recoloring, or sprite repainting. The original sheet is retained.
Suggested in-game visible upright character size: roughly 32–42 x 40–48
logical pixels; adapt for your existing game's camera and coordinate system.
