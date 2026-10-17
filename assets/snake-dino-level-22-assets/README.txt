SNAKE DINO — LEVEL 22 ASSET PACKAGE

CONTENTS
characters/: six separate full-character transparent RGBA PNGs, 640 x 512 each.
heads/: six portrait crops of the corresponding poses, 320 x 320 each.
original-sprite-sheet.png: your uploaded reference, preserved unchanged.
assets.json: paths, suggested state timing, content bounds, and limitations.
CODEX-LEVEL-22-PROMPT.txt: complete implementation instructions for your game.

POSES
idle: coiled ready pose
slither_01: extended movement pose
slither_02: alternate movement pose
eat: tongue / food reaction
hit: collision reaction
dead: collapsed final death pose

HOW TO USE
Extract this folder into your existing game project or attach the ZIP to Codex.
Open CODEX-LEVEL-22-PROMPT.txt and paste it into Codex in your game workspace.
The prompt defines a classic grid-based Snake campaign stage, not an auto-runner.
Its campaign objective is 40 food items, followed by optional endless play.

IMPORTANT
This artwork is side-view character art. It does not contain seamless body,
corner or tail tiles, nor four directional heads. The prompt explicitly asks
Codex to construct matching body pieces using your existing game's pixel-art
rendering workflow. It must not repeat the entire character in every body cell.

The head files are cropped portraits, not newly drawn directional views.
The death and idle states have one supplied pose each. A short hold/transition
can use them; do not treat them as a longer native animation sequence.

Individual sprites were cropped from manually separated source regions, with
nearly invisible outer alpha speckles excluded from crop bounds. Pixels inside
the visible crop keep their original color/alpha. No resampling, repainting,
rotation, or recoloring was performed. The original source remains unchanged.
Use nearest-neighbor rendering, a consistent scale, and explicit body collisions.
Transparent canvas dimensions are not character collision dimensions.
