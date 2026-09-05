  // LEVEL 6: Apocalyptic Cyber-Skyscraper & Mutants (Epic Scale)
  levels.push({
    name:'ეპ.6 — აპოკალიფსური ცათამბჯენი და ნეონის ჯოჯოხეთი 🌆🔥',
    diffRating: 'ექსტრემალური🔥', diffStars: '⭐⭐⭐⭐⭐', diffColor: '#ef4444',
    gimmickTitle: '🏢 NEON HELL, MEGA TRAPS & ATTACKING BIRDS 🦅',
    diffDesc: 'ყველაზე რთული გამოწვევა! მბრუნავი ხერხები, ლაზერები, მჟავის გეიზერები, გრავიტაციის რუნები და ახალი ხაფანგები!',
    zombieSpeedMult: 1.35, zombieHpMult: 1.3, gravityMult: 1.0, hazardType: 'neon_sky_birds',
    isCustomLayout: true,
    theme: 'decaying_skyscraper',
    width: 14000,
    height: 3000,
    spawn:{x:100, y:GROUND_Y-60},
    checkpoints: [
      { x: 3000, y: GROUND_Y, active: false },
      { x: 6500, y: GROUND_Y, active: false },
      { x: 10000, y: GROUND_Y - 1400, active: false }
    ],
    plats: [
      // === ZONE 1: The Acid Wastes & Toxic Factory (0 - 3500) ===
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

      // === ZONE 2: Trap Gauntlet (3500 - 6800) ===
      rect(3600, GROUND_Y - 80, 120, 24),
      rect(3800, GROUND_Y - 160, 120, 24),
      rect(4000, GROUND_Y - 240, 120, 24),
      // Vertical Cargo Lift
      rect(4250, GROUND_Y - 240, 150, 24, {vy: 2.8, minY: GROUND_Y - 550, maxY: GROUND_Y - 240}),
      // High altitude walkway
      rect(4450, GROUND_Y - 550, 1200, 24),
      rect(5750, GROUND_Y - 550, 200, 24, {isTreadmill: true, beltSpeed: -4.5}),
      rect(6050, GROUND_Y - 550, 140, 24),
      // Drop down to next checkpoint
      rect(6250, GROUND_Y - 200, 120, 24),
      rect(6450, GROUND_Y, 600, 90),

      // === ZONE 3: The Skyscraper Ascent (Mega Sky Climb) (7000 - 10500) ===
      rect(7200, GROUND_Y - 120, 140, 24),
      rect(7400, GROUND_Y - 240, 140, 24),
      rect(7600, GROUND_Y - 360, 140, 24),
      // Trampoline pads will be placed here
      rect(7900, GROUND_Y - 600, 150, 24),
      rect(8200, GROUND_Y - 720, 150, 24),
      rect(8500, GROUND_Y - 840, 150, 24),
      rect(8800, GROUND_Y - 960, 150, 24),
      // Epic Shuttle Sequence
      rect(9100, GROUND_Y - 960, 160, 24, {vx: 3.2, minX: 9080, maxX: 9550}),
      // Zone 3 Basecamp
      rect(9800, GROUND_Y - 1400, 800, 24),

      // === ZONE 4: The Rooftop Boss Arena (10500 - 14000) ===
      rect(10800, GROUND_Y - 1550, 140, 24),
      rect(11100, GROUND_Y - 1700, 140, 24),
      rect(11500, GROUND_Y - 1850, 2000, 90) // Final Mega Arena
    ],
    spikes: [
      // Toxic Acid Lakes
      rect(800, GROUND_Y + 70, 150, 20),
      rect(1150, GROUND_Y + 70, 150, 20),
      rect(1700, GROUND_Y + 70, 1300, 20)
    ],
    trampolines: [
      rect(7650, GROUND_Y - 378, 40, 18, {bouncePower: 1.8}), // Boost to -600
      rect(9900, GROUND_Y - 1418, 50, 18, {bouncePower: 2.1}), // Super boost to rooftop!
      rect(13100, GROUND_Y - 1868, 50, 18, {bouncePower: 2.5}) // Launch to flag!
    ],
    jumpboxes: [
      rect(1400, GROUND_Y - 120, 40, 40, {type: 'coin'}),
      rect(1500, GROUND_Y - 120, 40, 40, {type: 'weapon'}),
      rect(5000, GROUND_Y - 670, 40, 40, {type: 'shield'}),
      rect(10100, GROUND_Y - 1520, 40, 40, {type: 'coin'}),
      rect(10200, GROUND_Y - 1520, 40, 40, {type: 'rage'})
    ],
    bananas: [
      rect(2350, GROUND_Y - 114, 40, 14),
      rect(4800, GROUND_Y - 564, 40, 14)
    ],
    barrelSpawners: [
      { x: 5500, y: GROUND_Y - 570 },
      { x: 12500, y: GROUND_Y - 1870 }
    ],
    boulders: [
      { x: 5500, startX: 5500, minX: 4450, y: GROUND_Y - 570, r: 18, vx: -2.5, angle: 0 },
      { x: 12500, startX: 12500, minX: 11500, y: GROUND_Y - 1870, r: 24, vx: -3.5, angle: 0 }
    ],
    spinners: [
      { cx: 3700, cy: GROUND_Y - 160, r: 40, angle: 0, speed: 0.1 },
      { cx: 4100, cy: GROUND_Y - 300, r: 45, angle: 0, speed: -0.15 },
      { cx: 8000, cy: GROUND_Y - 700, r: 50, angle: 0, speed: 0.12 }
    ],
    swingingAxes: [
      { cx: 4600, cy: GROUND_Y - 800, len: 250, angle: 0, speed: 0.003, range: 1.5, offset: 0 },
      { cx: 4900, cy: GROUND_Y - 800, len: 250, angle: 0, speed: 0.003, range: 1.5, offset: 1.5 },
      { cx: 5200, cy: GROUND_Y - 800, len: 250, angle: 0, speed: 0.003, range: 1.5, offset: 3.0 }
    ],
    acidGeysers: [
      { x: 1400, y: GROUND_Y, w: 30, h: 180, timer: 0, activeTime: 120, offTime: 180, active: false }
    ],
    firejets: [
      { x: 2100, y: GROUND_Y - 50, w: 20, h: 150, timer: 0, activeTime: 100, offTime: 150, active: false }
    ],
    lasers: [
      { x: 4500, y: GROUND_Y - 570, w: 100, h: 20, timer: 0, activeTime: 200, offTime: 100, active: false },
      { x: 5300, y: GROUND_Y - 570, w: 100, h: 20, timer: 0, activeTime: 200, offTime: 100, active: false }
    ],
    crushers: [
      { x: 8200, y: GROUND_Y - 960, w: 60, h: 80, strokeY: 0, speed: 4, isDown: false }
    ],
    boosters: [
      rect(3100, GROUND_Y - 10, 80, 10),
      rect(6500, GROUND_Y - 10, 80, 10)
    ],
    gravityRunes: [
      rect(8700, GROUND_Y - 900, 30, 30),
      rect(11300, GROUND_Y - 1800, 30, 30)
    ],
    birds: [
      { x: 1600, y: GROUND_Y - 250, w: 46, h: 42, vx: 2, vy: 0, speed: 2, rangeX: 300, startX: 1600, startY: GROUND_Y - 250, type: 'mutant_crow', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 2800, y: GROUND_Y - 350, w: 56, h: 52, vx: 3, vy: 0, speed: 3, rangeX: 400, startX: 2800, startY: GROUND_Y - 350, type: 'fire_hawk', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 5000, y: GROUND_Y - 750, w: 56, h: 52, vx: 3.5, vy: 0, speed: 3.5, rangeX: 400, startX: 5000, startY: GROUND_Y - 750, type: 'fire_hawk', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 8000, y: GROUND_Y - 900, w: 46, h: 42, vx: 2.5, vy: 0, speed: 2.5, rangeX: 350, startX: 8000, startY: GROUND_Y - 900, type: 'mutant_crow', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 11800, y: GROUND_Y - 2100, w: 56, h: 52, vx: 4, vy: 0, speed: 4, rangeX: 500, startX: 11800, startY: GROUND_Y - 2100, type: 'fire_hawk', state: 'patrol', flapTimer: 0, swoopCooldown: 0 },
      { x: 12400, y: GROUND_Y - 2100, w: 56, h: 52, vx: -4, vy: 0, speed: 4, rangeX: 500, startX: 12400, startY: GROUND_Y - 2100, type: 'fire_hawk', state: 'patrol', flapTimer: 0, swoopCooldown: 0 }
    ],
    zombies: [
      { x: 1400, y: GROUND_Y - 54, type: 'fast' },
      { x: 2350, y: GROUND_Y - 154, type: 'ranged' },
      { x: 3100, y: GROUND_Y - 54, type: 'tank' },
      { x: 3300, y: GROUND_Y - 54, type: 'mutant' },
      { x: 4500, y: GROUND_Y - 604, type: 'ranged' },
      { x: 5100, y: GROUND_Y - 604, type: 'fast' },
      { x: 6700, y: GROUND_Y - 54, type: 'boss' },
      { x: 6900, y: GROUND_Y - 54, type: 'tank' },
      { x: 7900, y: GROUND_Y - 654, type: 'ranged' },
      { x: 8800, y: GROUND_Y - 994, type: 'fast' },
      { x: 10100, y: GROUND_Y - 1454, type: 'tank' },
      { x: 11800, y: GROUND_Y - 1904, type: 'mutant' },
      { x: 12200, y: GROUND_Y - 1904, type: 'boss' },
      { x: 12700, y: GROUND_Y - 1904, type: 'elite' },
      { x: 13200, y: GROUND_Y - 1904, type: 'mutant' }
    ],
    coins: [
      rect(1850, GROUND_Y - 50, 22, 22),
      rect(1900, GROUND_Y - 50, 22, 22),
      rect(2650, GROUND_Y - 150, 22, 22),
      rect(2700, GROUND_Y - 150, 22, 22),
      rect(4300, GROUND_Y - 300, 22, 22),
      rect(4300, GROUND_Y - 350, 22, 22),
      rect(4300, GROUND_Y - 400, 22, 22),
      rect(7900, GROUND_Y - 650, 22, 22),
      rect(8200, GROUND_Y - 770, 22, 22),
      rect(8500, GROUND_Y - 890, 22, 22),
      rect(12500, GROUND_Y - 1950, 22, 22, {isTrap: true}), // Cursed coin!
      rect(12900, GROUND_Y - 1920, 22, 22)
    ],
    signs: [
      { x: 200, y: GROUND_Y - 60, text: '☣️ ტოქსიკური ზონა! გამოიყენე მოძრავი პლატფორმები და ტრედმილები!' },
      { x: 4400, y: GROUND_Y - 560, text: '🪓 სიკვდილის დერეფანი: მბრუნავი ხერხები და ლაზერები!' },
      { x: 7200, y: GROUND_Y - 130, text: '🚀 სუპერ ბატუტები და 🔮 გრავიტაციის რუნები — ადი ცათამბჯენის სახურავზე!' },
      { x: 9900, y: GROUND_Y - 1460, text: '💀 ფინალური არენა! მოემზადე უდიდესი ბრძოლისთვის!' }
    ],
    flag: rect(13500, GROUND_Y - 2400, 30, 140, { isFireFlame: true })
  });
