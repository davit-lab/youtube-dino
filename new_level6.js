  // LEVEL 6: Apocalyptic Cyber-Skyscraper & Mutants (Epic Scale)
  levels.push({
    name:'ეპ.6 — ნეონის ჯოჯოხეთი & მუტანტთა ცათამბჯენი 🏢🔥🦅',
    diffRating: 'ექსტრემალური🔥', diffStars: '⭐⭐⭐⭐⭐', diffColor: '#ef4444',
    gimmickTitle: '🏢 MEGA OBBY, SUPER TRAMPOLINES & ATTACKING BIRDS 🦅',
    diffDesc: 'გადალახე მჟავის ტბები, იფრინე სუპერ ტრამპლინებით, აარიდე თავი ცეცხლოვან ფრინველებს და აცოცდი ცათამბჯენის სახურავზე!',
    zombieSpeedMult: 1.35, zombieHpMult: 1.25, gravityMult: 1.0, hazardType: 'neon_sky_birds',
    isCustomLayout: true,
    theme: 'decaying_skyscraper',
    width: 12500,
    height: 2500,
    spawn:{x:100, y:GROUND_Y-60},
    checkpoints: [
      { x: 3000, y: GROUND_Y, active: false },
      { x: 6200, y: GROUND_Y, active: false },
      { x: 9200, y: GROUND_Y - 1200, active: false }
    ],
    plats: [
      // === ZONE 1: The Acid Wastes & Toxic Factory (0 - 3200) ===
      rect(0, GROUND_Y, 800, 90),
      rect(950, GROUND_Y, 200, 90),
      rect(1300, GROUND_Y, 400, 90),
      // Elevators & Treadmills over deadly gaps
      rect(1800, GROUND_Y, 150, 24, {isTreadmill: true, beltSpeed: 4.0}),
      rect(2050, GROUND_Y - 50, 150, 24, {isTreadmill: true, beltSpeed: -3.5}),
      rect(2300, GROUND_Y - 100, 200, 24),
      // Moving Shuttle
      rect(2600, GROUND_Y - 100, 160, 24, {vx: 3.5, minX: 2580, maxX: 2950}),
      // Zone 1 Safe Outpost
      rect(3000, GROUND_Y, 500, 90),

      // === ZONE 2: Construction Yard & Drone Ambush (3500 - 6400) ===
      rect(3600, GROUND_Y - 80, 120, 24),
      rect(3800, GROUND_Y - 160, 120, 24),
      rect(4000, GROUND_Y - 240, 120, 24),
      // Vertical Cargo Lift
      rect(4250, GROUND_Y - 240, 150, 24, {vy: 2.8, minY: GROUND_Y - 550, maxY: GROUND_Y - 240}),
      // High altitude walkway
      rect(4450, GROUND_Y - 550, 800, 24),
      rect(5350, GROUND_Y - 550, 200, 24, {isTreadmill: true, beltSpeed: -4.5}),
      rect(5650, GROUND_Y - 550, 140, 24),
      // Drop down to next checkpoint
      rect(5900, GROUND_Y - 200, 120, 24),
      rect(6100, GROUND_Y, 600, 90),

      // === ZONE 3: The Skyscraper Ascent (Mega Sky Climb) (6700 - 10000) ===
      rect(6800, GROUND_Y - 120, 140, 24),
      rect(7000, GROUND_Y - 240, 140, 24),
      rect(7200, GROUND_Y - 360, 140, 24),
      // Mega Trampoline pads will be placed here
      rect(7450, GROUND_Y - 600, 150, 24),
      rect(7700, GROUND_Y - 720, 150, 24),
      rect(7950, GROUND_Y - 840, 150, 24),
      rect(8200, GROUND_Y - 960, 150, 24),
      // Epic Shuttle Sequence
      rect(8450, GROUND_Y - 960, 160, 24, {vx: 3.2, minX: 8430, maxX: 8850}),
      // Zone 3 Basecamp
      rect(9000, GROUND_Y - 1200, 600, 24),

      // === ZONE 4: The Rooftop Boss Arena (10000 - 12500) ===
      rect(9700, GROUND_Y - 1350, 140, 24),
      rect(9900, GROUND_Y - 1500, 140, 24),
      rect(10200, GROUND_Y - 1650, 2000, 90) // Final Mega Arena
    ],
    spikes: [
      // Toxic Acid Lakes
      rect(800, GROUND_Y + 70, 150, 20),
      rect(1150, GROUND_Y + 70, 150, 20),
      rect(1700, GROUND_Y + 70, 1300, 20),
      // Deadly lasers on the high walkway
      rect(4700, GROUND_Y - 570, 120, 20),
      rect(5000, GROUND_Y - 570, 120, 20),
      // Rooftop traps
      rect(10600, GROUND_Y - 1670, 150, 20),
      rect(11200, GROUND_Y - 1670, 150, 20)
    ],
    trampolines: [
      rect(7250, GROUND_Y - 378, 40, 18, {bouncePower: 1.8}), // Boost to -600
      rect(9100, GROUND_Y - 1218, 50, 18, {bouncePower: 2.1}), // Super boost to rooftop!
      rect(11800, GROUND_Y - 1668, 50, 18, {bouncePower: 2.5}) // Launch to flag!
    ],
    jumpboxes: [
      rect(1400, GROUND_Y - 120, 40, 40, {type: 'coin'}),
      rect(1500, GROUND_Y - 120, 40, 40, {type: 'weapon'}),
      rect(4800, GROUND_Y - 670, 40, 40, {type: 'shield'}),
      rect(9300, GROUND_Y - 1320, 40, 40, {type: 'coin'}),
      rect(9400, GROUND_Y - 1320, 40, 40, {type: 'rage'})
    ],
    bananas: [
      rect(2350, GROUND_Y - 114, 40, 14),
      rect(4600, GROUND_Y - 564, 40, 14)
    ],
    barrelSpawners: [
      { x: 5200, y: GROUND_Y - 570 },
      { x: 11000, y: GROUND_Y - 1670 }
    ],
    boulders: [
      { x: 5200, startX: 5200, minX: 4450, y: GROUND_Y - 570, r: 18, vx: -2.5, angle: 0 },
      { x: 11000, startX: 11000, minX: 10200, y: GROUND_Y - 1670, r: 24, vx: -3.5, angle: 0 }
    ],
    birds: [
      { x: 1600, y: GROUND_Y - 250, w: 46, h: 42, vx: 2, vy: 0, speed: 2, rangeX: 300, startX: 1600, startY: GROUND_Y - 250, type: 'mutant_crow', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 2800, y: GROUND_Y - 350, w: 56, h: 52, vx: 3, vy: 0, speed: 3, rangeX: 400, startX: 2800, startY: GROUND_Y - 350, type: 'fire_hawk', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 4900, y: GROUND_Y - 750, w: 56, h: 52, vx: 3.5, vy: 0, speed: 3.5, rangeX: 400, startX: 4900, startY: GROUND_Y - 750, type: 'fire_hawk', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 7600, y: GROUND_Y - 900, w: 46, h: 42, vx: 2.5, vy: 0, speed: 2.5, rangeX: 350, startX: 7600, startY: GROUND_Y - 900, type: 'mutant_crow', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 10800, y: GROUND_Y - 1900, w: 56, h: 52, vx: 4, vy: 0, speed: 4, rangeX: 500, startX: 10800, startY: GROUND_Y - 1900, type: 'fire_hawk', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 11400, y: GROUND_Y - 1900, w: 56, h: 52, vx: -4, vy: 0, speed: 4, rangeX: 500, startX: 11400, startY: GROUND_Y - 1900, type: 'fire_hawk', state: 'patrol', flapTimer: 0, swoopCooldown: 0 }
    ],
    zombies: [
      { x: 1400, y: GROUND_Y - 54, type: 'fast' },
      { x: 2350, y: GROUND_Y - 154, type: 'ranged' },
      { x: 3100, y: GROUND_Y - 54, type: 'tank' },
      { x: 3300, y: GROUND_Y - 54, type: 'mutant' },
      { x: 4500, y: GROUND_Y - 604, type: 'ranged' },
      { x: 5100, y: GROUND_Y - 604, type: 'fast' },
      { x: 6200, y: GROUND_Y - 54, type: 'boss' },
      { x: 6400, y: GROUND_Y - 54, type: 'tank' },
      { x: 7450, y: GROUND_Y - 654, type: 'ranged' },
      { x: 8000, y: GROUND_Y - 894, type: 'fast' },
      { x: 9300, y: GROUND_Y - 1254, type: 'tank' },
      { x: 10500, y: GROUND_Y - 1704, type: 'mutant' },
      { x: 10900, y: GROUND_Y - 1704, type: 'boss' },
      { x: 11500, y: GROUND_Y - 1704, type: 'elite' },
      { x: 11800, y: GROUND_Y - 1704, type: 'mutant' }
    ],
    coins: [
      rect(1850, GROUND_Y - 50, 22, 22),
      rect(1900, GROUND_Y - 50, 22, 22),
      rect(2650, GROUND_Y - 150, 22, 22),
      rect(2700, GROUND_Y - 150, 22, 22),
      rect(4300, GROUND_Y - 300, 22, 22),
      rect(4300, GROUND_Y - 350, 22, 22),
      rect(4300, GROUND_Y - 400, 22, 22),
      rect(7500, GROUND_Y - 650, 22, 22),
      rect(7750, GROUND_Y - 770, 22, 22),
      rect(8000, GROUND_Y - 890, 22, 22),
      rect(11200, GROUND_Y - 1750, 22, 22, {isTrap: true}), // Cursed coin!
      rect(11600, GROUND_Y - 1720, 22, 22)
    ],
    signs: [
      { x: 200, y: GROUND_Y - 60, text: '☣️ ტოქსიკური ზონა! გამოიყენე მოძრავი პლატფორმები და ტრედმილები!' },
      { x: 3050, y: GROUND_Y - 60, text: '🦅 ფრთხილად! მუტანტი ყვავები და ცეცხლოვანი შავარდნები უტევენ ციდან!' },
      { x: 6700, y: GROUND_Y - 60, text: '🚀 სუპერ ბატუტები! ახტი მათზე რომ აფრინდე ცათამბჯენის სახურავზე!' },
      { x: 9100, y: GROUND_Y - 1260, text: '💀 ფინალური არენა! მოემზადე უდიდესი ბრძოლისთვის!' }
    ],
    flag: rect(12200, GROUND_Y - 2200, 30, 140, { isFireFlame: true })
  });
