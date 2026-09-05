import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the block for Level 6
start_marker = r"// LEVEL 6: Apocalyptic Cyber-Skyscraper"
end_marker = r"// LEVEL 7:"

match = re.search(f"({start_marker}.*?)({end_marker})", content, re.DOTALL)
if not match:
    print("Could not find Level 6")
    exit(1)

level_code = match.group(1)

# I will just write a regex to replace the plats array inside level_code
new_plats = """plats: [
      // === ZONE 1: The Acid Wastes & Toxic Factory (0 - 3500) ===
      rect(0, GROUND_Y, 800, 90),
      rect(950, GROUND_Y, 200, 90),
      rect(1300, GROUND_Y, 400, 90),
      // Elevators & Treadmills over deadly gaps
      rect(1800, GROUND_Y, 150, 24, {isTreadmill: true, beltSpeed: 4.0}),
      rect(2050, GROUND_Y - 40, 150, 24, {isTreadmill: true, beltSpeed: -3.5}),
      rect(2300, GROUND_Y - 80, 200, 24),
      // Moving Shuttle
      rect(2600, GROUND_Y - 80, 160, 24, {vx: 3.5, minX: 2580, maxX: 2950}),
      // Zone 1 Safe Outpost
      rect(3000, GROUND_Y, 500, 90),

      // === ZONE 2: Trap Gauntlet (3500 - 6800) ===
      rect(3580, GROUND_Y - 80, 140, 24),
      rect(3780, GROUND_Y - 160, 140, 24),
      rect(3980, GROUND_Y - 240, 140, 24),
      // Vertical Cargo Lift
      rect(4180, GROUND_Y - 240, 200, 24, {vy: 2.8, minY: GROUND_Y - 550, maxY: GROUND_Y - 240}),
      // High altitude walkway
      rect(4420, GROUND_Y - 550, 1200, 24),
      rect(5750, GROUND_Y - 550, 200, 24, {isTreadmill: true, beltSpeed: -4.5}),
      rect(6050, GROUND_Y - 550, 140, 24),
      // Drop down to next checkpoint
      rect(6250, GROUND_Y - 200, 140, 24),
      rect(6450, GROUND_Y, 600, 90),

      // === ZONE 3: The Skyscraper Ascent (Mega Sky Climb) (7000 - 10500) ===
      rect(7150, GROUND_Y - 80, 140, 24),
      rect(7350, GROUND_Y - 160, 140, 24),
      rect(7550, GROUND_Y - 240, 140, 24),
      rect(7750, GROUND_Y - 320, 140, 24),
      // Trampoline pads will be placed here (7650 trampoline will bounce from 7750 to -600)
      rect(7900, GROUND_Y - 600, 150, 24),
      rect(8200, GROUND_Y - 680, 150, 24),
      rect(8500, GROUND_Y - 760, 150, 24),
      rect(8800, GROUND_Y - 840, 150, 24),
      // Epic Shuttle Sequence
      rect(9050, GROUND_Y - 840, 200, 24, {vx: 3.2, minX: 9000, maxX: 9550}),
      // Zone 3 Basecamp
      rect(9800, GROUND_Y - 840, 800, 24),

      // === ZONE 4: The Rooftop Boss Arena (10500 - 14000) ===
      rect(10750, GROUND_Y - 920, 140, 24),
      rect(11000, GROUND_Y - 1000, 140, 24),
      rect(11250, GROUND_Y - 1080, 140, 24),
      rect(11500, GROUND_Y - 1080, 2000, 90) // Final Mega Arena
    ],"""

level_code = re.sub(r"plats:\s*\[.*?\](?:,)?", new_plats + ",", level_code, flags=re.DOTALL)

# Since we changed elevations in Zone 3 and 4, we must also update the positions of trampolines, checkpoints, birds, etc.
