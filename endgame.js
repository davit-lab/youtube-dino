/* Authored campaign stages and their traversal mechanics. Coordinates are
   measured upward from the world floor; no equipment upgrades are required. */
function buildEndgameLevels() {
  const G = GROUND_Y;
  const slab = (x, rise, w, h = 46, extra = {}) =>
    rect(x, G - rise, w, h, extra);
  const floor = (x, w) => slab(x, 0, w, 170);
  const ledge = (x, rise, w) => slab(x, rise, w, 22, { oneWay: true });
  const moving = (x, rise, w, travel, speed = 1.4) =>
    slab(x, rise, w, 28, {
      vx: speed,
      minX: x,
      maxX: x + travel,
      homeX: x,
      homeY: G - rise,
      homeVx: speed,
    });
  const spike = (x, rise, w = 54) => rect(x, G - rise - 24, w, 24);
  const checkpoint = (x, rise = 0) => ({ x, y: G - rise, active: false });
  const trail = (x, rise, count, spacing = 36, arc = 0) =>
    Array.from({ length: count }, (_, i) =>
      rect(
        x + i * spacing,
        G - rise - 48 - Math.sin((i / Math.max(1, count - 1)) * Math.PI) * arc,
        22,
        22,
      ),
    );
  const box = (x, rise, type) =>
    rect(x, G - rise - 122, 42, 42, { type, hit: false });
  const relic = (x, rise) => ({
    x,
    y: G - rise - 62,
    w: 26,
    h: 32,
    taken: false,
  });
  const saw = (x, to, rise, period = 3600, r = 27) => ({
    kind: "rail",
    x,
    to,
    y: G - rise - 28,
    r,
    period,
  });
  const dart = (x, rise, dir = -1, period = 3000) => ({
    kind: "dart",
    x,
    y: G - rise - 62,
    dir,
    period,
    w: 30,
    h: 32,
  });
  const rock = (x, rise = 0) => ({
    kind: "rock",
    x,
    y: G - rise - 280,
    floorY: G - rise,
    w: 48,
    h: 42,
    phase: "idle",
    timer: 0,
    dropY: G - rise - 280,
  });
  const gate = (x, rise = 0, period = 3000, offset = 0) => ({
    kind: "pulse",
    x,
    y: G - rise - 120,
    w: 22,
    h: 120,
    period,
    offset,
  });
  const ruin = (type, x, w, h, extra = {}) => ({
    type,
    x,
    y: G,
    w,
    h,
    ...extra,
  });
  const base = (n, name, theme, music, width) => ({
    name: `ეპ.${n} — ${name}`,
    theme,
    musicTrack: music,
    width,
    spawn: { x: 70, y: G - 54 },
    height: H,
    keepDesign: true,
    masterDesign: true,
    endgameDesign: true,
    checkpointRespawn: true,
    diffRating: n < 18 ? "რთული" : "ძალიან რთული",
    diffStars: "⭐⭐⭐",
    diffColor: "#e2b86b",
    gimmickTitle: name,
    gravityMult: 1,
    zombieSpeedMult: 0.65,
    zombieHpMult: 0.8,
    plats: [],
    spikes: [],
    coins: [],
    jumpboxes: [],
    checkpoints: [],
    relics: [],
    supplyCaches: [],
    obstacles: [],
    sections: [],
    setPieces: [],
    doors: [],
    switches: [],
    flag: rect(width - 160, G - 140, 30, 140),
    zombies: [],
  });

  const jungle = base(
    15,
    "დაკარგული აკვედუკი",
    "prehistoric_jungle",
    "jungle",
    10600,
  );
  Object.assign(jungle, {
    sections: [
      { x: 0, title: "FERN VALLEY" },
      { x: 1600, title: "THE BROKEN AQUEDUCT" },
      { x: 3460, title: "OLD STONE MILL" },
      { x: 5240, title: "CANOPY CROSSING" },
      { x: 7150, title: "THE SUNKEN TEMPLE" },
      { x: 9100, title: "THE LAST WATCH" },
    ],
    // Low jungle floor, one long ruined bridge, a mill route, then treetops.
    plats: [
      floor(0, 600),
      slab(665, 35, 180),
      floor(915, 600),
      slab(1610, 60, 200),
      slab(1880, 130, 210),
      slab(2160, 90, 290),
      slab(2515, 160, 190),
      slab(2770, 90, 190),
      floor(3040, 530),
      floor(3640, 780),
      floor(4500, 620),
      ledge(3700, 100, 180),
      ledge(3950, 185, 190),
      ledge(4220, 265, 150),
      slab(5210, 70, 200),
      slab(5480, 145, 230),
      moving(5780, 190, 200, 75),
      slab(6100, 120, 190),
      slab(6360, 205, 210),
      slab(6630, 125, 200),
      floor(6910, 950),
      floor(7930, 760),
      slab(8760, 55, 190),
      floor(9020, 1580),
      ledge(7250, 100, 180),
      ledge(7500, 195, 200),
      ledge(7780, 285, 190),
      ledge(9690, 110, 180),
      ledge(9940, 200, 200),
    ],
    spikes: [
      spike(1140, 0, 78),
      spike(4020, 0, 74),
      spike(8060, 0, 88),
      spike(9640, 0, 80),
    ],
    obstacles: [
      dart(535, 0, -1, 3600),
      dart(1450, 0, -1, 3300),
      saw(3710, 4200, 0, 4100),
      rock(4680),
      rock(4930),
      dart(8190, 0, 1, 3400),
      gate(8540, 0, 3200),
      saw(9300, 9550, 0, 3100),
    ],
    crumblingPlats: [
      slab(6820, 70, 120, 22, { broken: false, stepped: false }),
    ],
    swingingAxes: [
      { cx: 2350, cy: G - 285, len: 130, range: 0.9, speed: 0.0019 },
      { cx: 6210, cy: G - 330, len: 125, range: 1, speed: 0.0022, offset: 2 },
    ],
    swingPoints: [{ x: 5940, y: G - 330, len: 150, radius: 130 }],
    checkpoints: [
      checkpoint(3220),
      checkpoint(4770),
      checkpoint(7250),
      checkpoint(9220),
    ],
    coins: [
      ...trail(330, 0, 5),
      ...trail(1640, 70, 5, 36, 28),
      ...trail(2530, 160, 4),
      ...trail(3720, 100, 4),
      ...trail(3950, 185, 5),
      ...trail(5500, 150, 5),
      ...trail(6380, 205, 4),
      ...trail(7530, 195, 5),
      ...trail(9700, 110, 4),
      ...trail(9960, 200, 4),
    ],
    relics: [relic(4280, 265), relic(7820, 285), relic(10040, 200)],
    supplyCaches: [
      { x: 3160, y: G - 38, w: 40, h: 38 },
      { x: 7300, y: G - 38, w: 40, h: 38 },
    ],
    zombies: [
      { x: 1050, y: G - 54, type: "slow" },
      { x: 3310, y: G - 54, type: "slow" },
      { x: 7560, y: G - 54, type: "mutant" },
      { x: 10200, y: G - 54, type: "boss" },
    ],
    jumpboxes: [box(260, 0, "shotgun"), box(4710, 0, "minigun")],
    setPieces: [
      ruin("jungle_tree", 350, 370, 340),
      ruin("sky_arch", 1770, 600, 370),
      ruin("jungle_tree", 3150, 440, 390),
      ruin("jungle_tree", 5130, 440, 410),
      ruin("sky_arch", 7740, 520, 350),
      ruin("jungle_tree", 9930, 420, 365),
    ],
    doors: [{ id: "temple", x: 8840, y: G - 180, w: 36, h: 180, open: false }],
    switches: [{ id: "temple", x: 8280, y: G - 18, w: 42, h: 18 }],
    scene: {
      accent: "#b9d897",
      stone: "#394c3b",
      surface: "#91b579",
      sky: ["#092b31", "#315847", "#bdc799"],
      waterfalls: [
        { x: 1570, w: 70 },
        { x: 5880, w: 48 },
      ],
      landmarks: [
        { x: 3540, title: "STONE MILL", style: "mill" },
        { x: 8850, title: "TEMPLE DOOR", style: "ruin" },
      ],
    },
  });

  const sky = base(16, "ქარის არქივი", "sky_temple", "sky", 11100);
  Object.assign(sky, {
    sections: [
      { x: 0, title: "THE WIND ARCHIVE" },
      { x: 1360, title: "BROKEN CAUSEWAY" },
      { x: 3350, title: "THE CLOCK GALLERY" },
      { x: 5540, title: "CLOUD FERRY" },
      { x: 7840, title: "THE BELL TOWERS" },
      { x: 9520, title: "HOMEWARD BRIDGE" },
    ],
    plats: [
      floor(0, 720),
      slab(800, 65, 230),
      slab(1100, 135, 210),
      slab(1390, 200, 260),
      slab(1720, 130, 180),
      slab(1970, 215, 210),
      slab(2250, 150, 320),
      slab(2640, 75, 230),
      floor(2960, 500),
      floor(3540, 780),
      slab(4400, 80, 260),
      slab(4730, 165, 240),
      slab(5040, 90, 230),
      floor(5350, 650),
      slab(6080, 55, 230),
      moving(6380, 95, 230, 85, 1.2),
      slab(6800, 175, 260),
      moving(7130, 110, 220, 75, -1.2),
      floor(7530, 830),
      slab(8440, 90, 230),
      slab(8740, 180, 260),
      slab(9070, 95, 290),
      floor(9440, 1660),
      ledge(3670, 100, 220),
      ledge(3960, 195, 180),
      ledge(4210, 285, 180),
      ledge(7810, 100, 200),
      ledge(8080, 195, 160),
      ledge(8310, 280, 190),
      ledge(10140, 100, 200),
      ledge(10410, 195, 220),
    ],
    winds: [
      rect(1740, G - 280, 600, 260, { dir: 1, speed: 0.7 }),
      rect(6540, G - 250, 650, 220, { dir: -1, speed: 0.5 }),
    ],
    obstacles: [
      gate(560, 0, 4200),
      gate(2110, 215, 3400),
      saw(3690, 4200, 0, 4300, 26),
      rock(5540),
      rock(5810),
      gate(8960, 180, 3600, 700),
    ],
    crumblingPlats: [
      slab(2380, 245, 125, 22, { broken: false }),
      slab(6890, 275, 130, 22, { broken: false }),
    ],
    trampolines: [
      rect(7730, G - 18, 70, 18, { bouncePower: 1.1 }),
      rect(10000, G - 18, 70, 18, { bouncePower: 1.05 }),
    ],
    checkpoints: [
      checkpoint(3110),
      checkpoint(5480),
      checkpoint(7700),
      checkpoint(9680),
    ],
    coins: [
      ...trail(820, 65, 5),
      ...trail(1740, 135, 4),
      ...trail(2270, 150, 5),
      ...trail(3690, 100, 5),
      ...trail(3960, 195, 4),
      ...trail(6400, 95, 5),
      ...trail(6820, 175, 5),
      ...trail(8110, 195, 3),
      ...trail(8750, 180, 5),
      ...trail(10420, 195, 5),
    ],
    relics: [relic(4250, 285), relic(8350, 280), relic(10520, 195)],
    supplyCaches: [
      { x: 3020, y: G - 38, w: 40, h: 38 },
      { x: 7620, y: G - 38, w: 40, h: 38 },
    ],
    zombies: [
      { x: 410, y: G - 54, type: "slow" },
      { x: 3190, y: G - 54, type: "slow" },
      { x: 9730, y: G - 54, type: "mutant" },
    ],
    jumpboxes: [box(330, 0, "laser"), box(5390, 0, "plasma")],
    setPieces: [
      ruin("sky_arch", 850, 440, 320),
      ruin("sky_arch", 3430, 590, 395),
      ruin("sky_arch", 5320, 380, 310),
      ruin("sky_arch", 7800, 580, 410),
      ruin("sky_arch", 9680, 460, 340),
    ],
    scene: {
      accent: "#eacb86",
      stone: "#607b89",
      surface: "#e4dac0",
      sky: ["#1f425e", "#7fabbb", "#f0e7ce"],
      landmarks: [
        { x: 3400, title: "THE CLOCK GALLERY", style: "clock" },
        { x: 7900, title: "THE WEST BELL", style: "bell" },
      ],
    },
  });

  const neon = base(17, "ბოლო მატარებელი", "cyberpunk_alley", "neon", 11600);
  Object.assign(neon, {
    sections: [
      { x: 0, title: "NIGHT MARKET" },
      { x: 1820, title: "THE LOADING DOCK" },
      { x: 3630, title: "ROOFTOP SERVICE ROAD" },
      { x: 6040, title: "POWER STATION" },
      { x: 8430, title: "THE SIGNAL BRIDGE" },
      { x: 10150, title: "LAST TRAIN HOME" },
    ],
    plats: [
      floor(0, 950),
      slab(1020, 65, 220),
      slab(1310, 130, 240),
      slab(1620, 70, 170),
      floor(1870, 1620),
      floor(3570, 1010),
      slab(4660, 70, 230),
      slab(4960, 155, 310),
      slab(5340, 80, 260),
      floor(5680, 1640),
      slab(7400, 85, 230),
      slab(7700, 160, 200),
      slab(7970, 85, 340),
      floor(8390, 1600),
      slab(10070, 65, 180),
      floor(10320, 1280),
      ledge(1930, 100, 230),
      ledge(2230, 195, 200),
      ledge(2500, 265, 180),
      ledge(3760, 105, 190),
      ledge(4020, 195, 190),
      ledge(8900, 100, 210),
      ledge(9180, 195, 230),
      ledge(9490, 280, 180),
    ],
    conveyors: [
      rect(2700, G, 560, 18, { speed: -1.8 }),
      rect(6430, G, 540, 18, { speed: 1.6 }),
    ],
    obstacles: [
      dart(790, 0, -1, 3600),
      dart(1730, 70, -1, 3200),
      gate(2960, 0, 2800),
      saw(3730, 4270, 0, 3800),
      gate(6270, 0, 3200, 0),
      gate(6660, 0, 3200, 950),
      gate(7050, 0, 3200, 1800),
      saw(8590, 8880, 0, 3500),
      dart(9730, 0, -1, 2900),
    ],
    crushers: [
      {
        x: 2120,
        topY: G - 200,
        w: 100,
        h: 80,
        dropSpeed: 6,
        maxDrop: 140,
        riseSpeed: 3,
      },
      {
        x: 2370,
        topY: G - 200,
        w: 100,
        h: 80,
        dropSpeed: 6,
        maxDrop: 140,
        riseSpeed: 3,
      },
      {
        x: 10840,
        topY: G - 205,
        w: 100,
        h: 80,
        dropSpeed: 7,
        maxDrop: 145,
        riseSpeed: 3,
      },
    ],
    spikes: [spike(8470, 0, 70), spike(9310, 0, 70)],
    doors: [
      { id: "substation", x: 7270, y: G - 150, w: 38, h: 150, open: false },
    ],
    switches: [{ id: "substation", x: 6840, y: G - 18, w: 42, h: 18 }],
    checkpoints: [
      checkpoint(1920),
      checkpoint(3650),
      checkpoint(5800),
      checkpoint(8500),
      checkpoint(10410),
    ],
    coins: [
      ...trail(1050, 65, 4),
      ...trail(1340, 130, 5),
      ...trail(1950, 100, 5),
      ...trail(2240, 195, 5),
      ...trail(3780, 105, 4),
      ...trail(4060, 195, 4),
      ...trail(4980, 155, 6),
      ...trail(6510, 0, 5, 30, 50),
      ...trail(7730, 160, 4),
      ...trail(9200, 195, 5),
    ],
    relics: [relic(2550, 265), relic(4140, 195), relic(9530, 280)],
    supplyCaches: [
      { x: 3400, y: G - 38, w: 40, h: 38 },
      { x: 8450, y: G - 38, w: 40, h: 38 },
    ],
    zombies: [
      { x: 470, y: G - 54, type: "slow" },
      { x: 3370, y: G - 54, type: "mutant" },
      { x: 5900, y: G - 54, type: "slow" },
      { x: 10650, y: G - 54, type: "boss" },
    ],
    jumpboxes: [box(280, 0, "minigun"), box(5920, 0, "rocket")],
    setPieces: [
      ruin("neon_tower", 180, 270, 370, { seed: 3, label: "NIGHT MARKET" }),
      ruin("neon_tower", 1570, 280, 410, { seed: 5, label: "FREIGHT / 07" }),
      ruin("neon_tower", 3650, 320, 450, { seed: 2, label: "RADIO TBILISI" }),
      ruin("neon_tower", 6160, 390, 400, { seed: 7, label: "POWER / EAST" }),
      ruin("neon_tower", 9860, 330, 460, { seed: 1, label: "LAST TRAIN" }),
    ],
    scene: {
      accent: "#67c7d4",
      stone: "#1b2d40",
      surface: "#7899ac",
      sky: ["#0b1022", "#233650", "#926574"],
      landmarks: [
        { x: 2060, title: "LOADING BAY 07", style: "crane" },
        { x: 6160, title: "POWER STATION", style: "power" },
        { x: 10360, title: "NORTH PLATFORM", style: "station" },
      ],
    },
  });

  const cave = base(18, "ფარული მაღარო", "ultimate_cosmos", "crystal", 10900);
  Object.assign(cave, {
    sections: [
      { x: 0, title: "THE LANTERN SHAFT" },
      { x: 1420, title: "ROPE BRIDGE" },
      { x: 3270, title: "THE CUTTING ROOM" },
      { x: 5280, title: "CRYSTAL GALLERY" },
      { x: 7610, title: "FALLING STONE" },
      { x: 9360, title: "THE OLD EXIT" },
    ],
    plats: [
      floor(0, 850),
      slab(920, 60, 220),
      slab(1210, 125, 220),
      slab(1500, 75, 220),
      slab(1790, 145, 200),
      slab(2060, 85, 250),
      slab(2380, 150, 240),
      slab(2690, 85, 220),
      floor(2980, 670),
      floor(3730, 720),
      slab(4530, 60, 220),
      slab(4820, 130, 250),
      floor(5150, 1050),
      slab(6270, 75, 210),
      slab(6550, 145, 240),
      slab(6860, 85, 190),
      slab(7120, 160, 200),
      floor(7400, 1830),
      floor(9310, 1590),
      ledge(3830, 100, 180),
      ledge(4080, 185, 220),
      ledge(5700, 100, 200),
      ledge(5970, 185, 180),
      ledge(6220, 270, 170),
      ledge(9480, 100, 200),
      ledge(9750, 190, 220),
      ledge(10040, 280, 160),
    ],
    crumblingPlats: [
      slab(1590, 185, 135, 22, { broken: false }),
      slab(1870, 250, 125, 22, { broken: false }),
      slab(2160, 185, 130, 22, { broken: false }),
    ],
    obstacles: [
      rock(610),
      saw(3360, 3530, 0, 2800),
      saw(3800, 4290, 0, 3400),
      saw(5340, 5610, 0, 3100),
      rock(7780),
      rock(8090),
      rock(8450),
      rock(8890),
      dart(10200, 0, -1, 3300),
    ],
    spikes: [spike(3170, 0, 70), spike(5680, 0, 78), spike(9180, 0, 50)],
    checkpoints: [
      checkpoint(3120),
      checkpoint(5290),
      checkpoint(7510),
      checkpoint(9430),
    ],
    coins: [
      ...trail(950, 60, 4),
      ...trail(1510, 75, 4),
      ...trail(2080, 85, 5),
      ...trail(2710, 85, 4),
      ...trail(3850, 100, 4),
      ...trail(4090, 185, 5),
      ...trail(4870, 130, 5),
      ...trail(5720, 100, 4),
      ...trail(5990, 185, 4),
      ...trail(6580, 145, 5),
      ...trail(9490, 100, 5),
      ...trail(9780, 190, 5),
    ],
    relics: [relic(4180, 185), relic(6260, 270), relic(10090, 280)],
    supplyCaches: [
      { x: 3050, y: G - 38, w: 40, h: 38 },
      { x: 7460, y: G - 38, w: 40, h: 38 },
    ],
    zombies: [
      { x: 380, y: G - 54, type: "slow" },
      { x: 3250, y: G - 54, type: "mutant" },
      { x: 5500, y: G - 54, type: "slow" },
      { x: 9580, y: G - 54, type: "mutant" },
    ],
    jumpboxes: [box(260, 0, "shotgun"), box(5260, 0, "plasma")],
    setPieces: [
      ruin("crystal_cluster", 880, 270, 170, { seed: 3, color: "#94c8c6" }),
      ruin("crystal_cluster", 2930, 330, 230, { seed: 1, color: "#a6b6dc" }),
      ruin("crystal_cluster", 5110, 480, 280, { seed: 5, color: "#ad9fc3" }),
      ruin("crystal_cluster", 7320, 290, 220, { seed: 3, color: "#79b9be" }),
      ruin("crystal_cluster", 9760, 340, 250, { seed: 2, color: "#b9aed2" }),
    ],
    scene: {
      accent: "#b6b5d8",
      stone: "#3a384b",
      surface: "#9895ae",
      sky: ["#111521", "#282535", "#56535e"],
      landmarks: [
        { x: 300, title: "SHAFT 03", style: "mine" },
        { x: 3300, title: "CUTTING ROOM", style: "mine" },
        { x: 7640, title: "UNSTABLE ROOF", style: "mine" },
      ],
    },
  });

  const volcano = base(
    19,
    "ბაზალტის ქედი",
    "pro_volcano_magma",
    "volcano",
    11400,
  );
  Object.assign(volcano, {
    sections: [
      { x: 0, title: "THE ASH ROAD" },
      { x: 1630, title: "CINDER CHANNEL" },
      { x: 3640, title: "THE FORGE" },
      { x: 5820, title: "STEAM FERRY" },
      { x: 7890, title: "CRATER RIDGE" },
      { x: 10020, title: "THE OBSIDIAN DOOR" },
    ],
    plats: [
      floor(0, 820),
      slab(890, 60, 220),
      slab(1180, 130, 250),
      slab(1500, 75, 210),
      slab(1780, 145, 190),
      slab(2040, 85, 250),
      slab(2360, 155, 240),
      slab(2670, 80, 240),
      floor(2990, 800),
      floor(3870, 780),
      slab(4730, 65, 220),
      slab(5020, 140, 220),
      slab(5310, 80, 200),
      floor(5590, 860),
      moving(6520, 60, 230, 80, 1.3),
      slab(6940, 135, 240),
      slab(7250, 75, 240),
      floor(7570, 600),
      slab(8240, 70, 240),
      slab(8550, 145, 210),
      slab(8830, 220, 250),
      slab(9150, 145, 230),
      slab(9450, 70, 240),
      floor(9770, 1630),
      ledge(3960, 100, 190),
      ledge(4220, 190, 190),
      ledge(4480, 280, 170),
      ledge(10200, 100, 190),
      ledge(10460, 195, 200),
    ],
    lavas: [
      rect(820, G, 2170, 190),
      rect(4650, G, 940, 190),
      rect(6450, G, 1120, 190),
      rect(8170, G, 1600, 190),
    ],
    firejets: [
      {
        x: 2150,
        y: G - 85,
        w: 26,
        h: 14,
        flameH: 100,
        period: 3100,
        offset: 0,
      },
      {
        x: 2560,
        y: G - 155,
        w: 26,
        h: 14,
        flameH: 100,
        period: 3100,
        offset: 1200,
      },
      { x: 4000, y: G, w: 28, h: 14, flameH: 110, period: 3000, offset: 0 },
      { x: 4490, y: G, w: 28, h: 14, flameH: 110, period: 3000, offset: 1300 },
      {
        x: 8770,
        y: G - 145,
        w: 26,
        h: 14,
        flameH: 100,
        period: 3200,
        offset: 1500,
      },
    ],
    obstacles: [
      saw(500, 700, 0, 4000),
      saw(3190, 3570, 0, 3400),
      rock(5760),
      rock(6120),
      gate(10280, 0, 3300),
      saw(10700, 11020, 0, 3800),
    ],
    steamVents: [{ x: 6060, y: G, w: 42, h: 135, period: 3200, offset: 1900 }],
    checkpoints: [
      checkpoint(3140),
      checkpoint(5700),
      checkpoint(7700),
      checkpoint(9890),
    ],
    coins: [
      ...trail(920, 60, 5),
      ...trail(1800, 145, 4),
      ...trail(2390, 155, 5),
      ...trail(3980, 100, 4),
      ...trail(4260, 190, 4),
      ...trail(5040, 140, 5),
      ...trail(6530, 60, 5),
      ...trail(6970, 135, 5),
      ...trail(8860, 220, 5),
      ...trail(10480, 195, 4),
    ],
    relics: [relic(4510, 280), relic(8900, 220), relic(10540, 195)],
    supplyCaches: [
      { x: 3030, y: G - 38, w: 40, h: 38 },
      { x: 7620, y: G - 38, w: 40, h: 38 },
    ],
    zombies: [
      { x: 420, y: G - 54, type: "slow" },
      { x: 3710, y: G - 54, type: "mutant" },
      { x: 7770, y: G - 54, type: "mutant" },
      { x: 11000, y: G - 54, type: "boss" },
    ],
    jumpboxes: [box(240, 0, "rocket"), box(5650, 0, "minigun")],
    setPieces: [
      ruin("volcano_ridge", 620, 700, 330),
      ruin("volcano_ridge", 2730, 680, 370),
      ruin("volcano_ridge", 5350, 620, 305),
      ruin("volcano_ridge", 7860, 740, 400),
      ruin("volcano_ridge", 9600, 670, 300),
    ],
    scene: {
      accent: "#ebb177",
      stone: "#382d2d",
      surface: "#a38670",
      sky: ["#241c26", "#62433b", "#bc8e68"],
      landmarks: [
        { x: 3940, title: "THE OLD FORGE", style: "forge" },
        { x: 7630, title: "CRATER STATION", style: "mine" },
      ],
    },
  });

  const finale = base(
    20,
    "შუქურის უკანასკნელი მცველი",
    "ultimate_cosmos",
    "finale",
    10400,
  );
  Object.assign(finale, {
    sections: [
      { x: 0, title: "THE QUIET APPROACH" },
      { x: 1730, title: "FIRST SEAL" },
      { x: 3580, title: "THE RESONANCE HALL" },
      { x: 5820, title: "LAST WATCHPOINT" },
      { x: 7420, title: "THE WORLD EATER" },
    ],
    plats: [
      floor(0, 1000),
      slab(1070, 70, 230),
      slab(1370, 140, 280),
      floor(1730, 1530),
      slab(3340, 75, 230),
      slab(3640, 150, 240),
      slab(3950, 85, 250),
      floor(4280, 1260),
      slab(5610, 75, 260),
      slab(5940, 150, 210),
      floor(6230, 1170),
      floor(7480, 2920),
      ledge(1940, 100, 190),
      ledge(2200, 190, 210),
      ledge(2480, 280, 200),
      ledge(4590, 100, 190),
      ledge(4850, 190, 240),
      ledge(6550, 100, 190),
      ledge(6810, 190, 240),
      ledge(7830, 110, 250),
      ledge(8830, 170, 260),
      ledge(9440, 95, 240),
    ],
    obstacles: [
      gate(2110, 0, 3400),
      gate(2670, 0, 3400, 1300),
      saw(4440, 4770, 0, 4000),
      gate(5200, 0, 3200),
      rock(6450),
    ],
    doors: [
      { id: "seal-one", x: 3130, y: G - 155, w: 36, h: 155, open: false },
      { id: "seal-two", x: 7280, y: G - 155, w: 36, h: 155, open: false },
    ],
    switches: [
      { id: "seal-one", x: 2780, y: G - 18, w: 42, h: 18 },
      { id: "seal-two", x: 6970, y: G - 18, w: 42, h: 18 },
    ],
    bossSpawnX: 8800,
    bossFloorY: G,
    bossArena: { start: 7520, end: 9960, trigger: 7750 },
    bossSkin: {
      name: "THE WORLD EATER",
      nameGeo: "სამყაროთა მჭამელი",
      color: "#172333",
      auraColor: "#8fcdd2",
      hp: 1200,
      speed: 2.2,
      reward: 5000,
    },
    checkpoints: [
      checkpoint(1850),
      checkpoint(4380),
      checkpoint(6330),
      checkpoint(7580),
    ],
    coins: [
      ...trail(1100, 70, 5),
      ...trail(1400, 140, 5),
      ...trail(1950, 100, 4),
      ...trail(2230, 190, 5),
      ...trail(3360, 75, 4),
      ...trail(3670, 150, 5),
      ...trail(4610, 100, 4),
      ...trail(4870, 190, 5),
      ...trail(6570, 100, 4),
      ...trail(6840, 190, 5),
    ],
    relics: [relic(2550, 280), relic(4930, 190), relic(6870, 190)],
    supplyCaches: [
      { x: 1800, y: G - 38, w: 40, h: 38 },
      { x: 6310, y: G - 38, w: 40, h: 38 },
      { x: 7570, y: G - 38, w: 40, h: 38, weapon: "plasma" },
    ],
    zombies: [
      { x: 710, y: G - 54, type: "slow" },
      { x: 3030, y: G - 54, type: "mutant" },
      { x: 4570, y: G - 54, type: "mutant" },
      { x: 6600, y: G - 54, type: "boss" },
    ],
    jumpboxes: [box(310, 0, "plasma"), box(6390, 0, "rocket")],
    setPieces: [
      ruin("cosmic_gate", 750, 500, 400),
      ruin("cosmic_gate", 3280, 450, 380),
      ruin("cosmic_gate", 6050, 500, 410),
      ruin("cosmic_gate", 9050, 550, 460),
    ],
    scene: {
      accent: "#adcbd1",
      stone: "#263341",
      surface: "#90a5ad",
      sky: ["#0d1b2b", "#284251", "#869ca2"],
      landmarks: [
        { x: 1960, title: "FIRST SEAL", style: "ruin" },
        { x: 6420, title: "LAST WATCH", style: "ruin" },
        { x: 9680, title: "THE LIGHTHOUSE", style: "beacon" },
      ],
    },
  });
  // Each encounter sits on a wide landing, away from checkpoints and gap
  // takeoffs. Teach a movement, give a recovery lane, then vary its timing.
  const teeth = (x, w, period, offset = 0) => ({
    kind: "teeth",
    x,
    y: G - 26,
    w,
    h: 26,
    period,
    offset,
  });
  const press = (x, period, offset = 0) => ({
    kind: "press",
    x,
    y: G - 235,
    w: 70,
    h: 72,
    floorY: G,
    period,
    offset,
  });
  const crawl = (x, w, material) => ({
    kind: "crawl",
    x,
    y: G - 112,
    w,
    h: 76,
    material,
  });
  jungle.obstacles.push(
    crawl(6970, 180, "roots"),
    teeth(10090, 66, 3600),
    teeth(10300, 66, 3600, 1500),
  );
  sky.obstacles.push(
    teeth(3280, 64, 4000),
    press(7880, 4300),
    press(9660, 3900, 1600),
  );
  neon.obstacles.push(
    crawl(2500, 160, "duct"),
    teeth(9020, 70, 3200),
    press(10600, 3600),
  );
  cave.obstacles.push(
    crawl(5860, 170, "stone"),
    teeth(9690, 72, 3500),
    teeth(9920, 72, 3500, 1500),
  );
  volcano.obstacles.push(
    press(4120, 4000),
    teeth(7880, 70, 3400),
    press(10000, 3600, 1200),
  );
  finale.obstacles.push(
    teeth(440, 64, 3800),
    crawl(2350, 170, "stone"),
    press(7090, 4000),
  );
  // Barrel lanes replace conflicting hazards rather than stacking damage.
  // One predictable barrel at a time; shooting or an ordinary jump works.
  const barrelLane = (lvl, minX, x, speed, material = "wood") => {
    lvl.barrelSpawners = [];
    lvl.barrelLanes = [
      { minX, x, y: G, speed, material, cooldown: 3300, warningMs: 1000 },
    ];
    lvl.obstacles = lvl.obstacles.filter((o) => {
      const end = o.kind === "rail" ? o.to : o.x + (o.w || 30);
      return end < minX - 60 || o.x > x + 60;
    });
    lvl.spikes = lvl.spikes.filter(
      (o) => o.x + o.w < minX - 60 || o.x > x + 60,
    );
    lvl.zombies = lvl.zombies.filter((o) => o.x < minX - 80 || o.x > x + 80);
    // A coin arc teaches where to launch a jump over the first barrel.
    lvl.coins.push(...trail(minX + 100, 30, 5, 32, 65));
  };
  barrelLane(jungle, 4610, 5050, 2.5);
  jungle.checkpoints[1].x = 4550;
  jungle.jumpboxes[1].x = 4520;
  barrelLane(sky, 10060, 10900, 2.6, "stone");
  barrelLane(neon, 2750, 3370, 2.9, "steel");
  barrelLane(cave, 7620, 8270, 2.6);
  barrelLane(volcano, 10420, 11080, 2.8, "steel");
  barrelLane(finale, 4510, 4930, 2.7, "stone");
  const crate = (x) => ({ kind: "crate", x, y: G - 42, w: 54, h: 42 });
  // Low freight and broken masonry introduce easy hops on safe ground.
  neon.obstacles.push(crate(5930), crate(6120));
  cave.obstacles.push(crate(10380), crate(10600));
  // Optional clockwork routes: the normal ground route remains available.
  const clockRoute = (lvl, id, buttonX, startX) => {
    const route = {
      id,
      x: buttonX,
      y: G - 18,
      w: 44,
      h: 18,
      duration: 10000,
      remaining: 0,
      inside: false,
    };
    lvl.clockRoutes = [route];
    // A missed bonus jump lands on a recovery lane, not another trap.
    const damageKinds = ["rail", "pulse", "press", "teeth", "rock", "dart"];
    lvl.obstacles = lvl.obstacles.filter((o) => {
      const end = o.kind === "rail" ? o.to : o.x + (o.w || 30);
      return (
        !damageKinds.includes(o.kind) || end < startX - 50 || o.x > startX + 590
      );
    });
    lvl.spikes = lvl.spikes.filter(
      (o) => o.x + o.w < startX - 50 || o.x > startX + 590,
    );
    for (let i = 0; i < 3; i++)
      lvl.plats.push(
        slab(startX + i * 220, 75 + i * 75, 150, 20, {
          oneWay: true,
          adventureBridge: id,
          enabled: false,
        }),
      );
    lvl.treasures = [
      {
        x: startX + 480,
        y: G - 225 - 36,
        w: 38,
        h: 36,
        taken: false,
        route: id,
      },
    ];
    lvl.coins.push(
      ...trail(startX + 15, 75, 3, 35),
      ...trail(startX + 235, 150, 3, 35),
    );
  };
  clockRoute(jungle, "mill-clock", 9180, 9350);
  clockRoute(neon, "service-clock", 5830, 6000);
  neon.jumpboxes[1].x = 5740;
  neon.zombies = neon.zombies.filter((z) => z.x !== 5900);
  neon.obstacles = neon.obstacles.filter(
    (o) => !(o.kind === "rail" && o.x === 3730),
  );
  for (const o of neon.obstacles) {
    if (o.kind === "crate" && o.x === 5930) o.x = 3700;
    if (o.kind === "crate" && o.x === 6120) o.x = 3910;
  }
  // Suspended cargo follows a slow, readable arc. No hidden acceleration.
  const cargo = (lvl, x, period, offset = 0) => {
    lvl.obstacles = lvl.obstacles.filter((o) => Math.abs(o.x - x) > 170);
    lvl.steamVents = (lvl.steamVents || []).filter(
      (o) => Math.abs(o.x - x) > 170,
    );
    lvl.obstacles.push({
      kind: "cargo",
      x,
      y: G - 255,
      w: 48,
      h: 48,
      len: 210,
      range: 0.62,
      period,
      offset,
    });
  };
  cargo(sky, 7900, 4800);
  cargo(neon, 11140, 4400, 1600);
  cargo(volcano, 5950, 5000);
  sky.treasures = [{ x: 8400, y: G - 280 - 36, w: 38, h: 36, taken: false }];
  cave.treasures = [{ x: 6060, y: G - 185 - 36, w: 38, h: 36, taken: false }];
  volcano.treasures = [
    { x: 4300, y: G - 190 - 36, w: 38, h: 36, taken: false },
  ];
  finale.treasures = [{ x: 8970, y: G - 170 - 36, w: 38, h: 36, taken: false }];
  return [jungle, sky, neon, cave, volcano, finale];
}

function resetEndgame(lvl) {
  if (!lvl.endgameDesign) return;
  lvl.adventureTime = 0;
  lvl.trapShots = [];
  lvl.boulders = [];
  for (const lane of lvl.barrelLanes || []) {
    lane.phase = "idle";
    lane.timer = 0;
    lane.serial = 0;
  }
  lvl.relicCount = 0;
  lvl.treasureCount = 0;
  for (const route of lvl.clockRoutes || []) {
    route.remaining = 0;
    route.inside = false;
  }
  for (const chest of lvl.treasures || []) chest.taken = false;
  for (const p of lvl.plats) if (p.adventureBridge) p.enabled = false;
  for (const p of lvl.plats) {
    if (p.homeX !== undefined) {
      p.x = p.homeX;
      p.y = p.homeY;
      p.vx = p.homeVx;
    }
  }
  for (const r of lvl.relics) r.taken = false;
  for (const cache of lvl.supplyCaches) cache.taken = false;
  for (const door of lvl.doors) door.open = false;
  for (const button of lvl.switches) button.pressed = false;
  for (const o of lvl.obstacles) {
    o.phase = "idle";
    o.timer = 0;
    o.dropY = o.y;
    o.lastBurst = -1;
    o.active = false;
    o.pressY = o.y;
  }
}

function updateEndgame(dt) {
  if (!level.endgameDesign || player.dead || player.isFalling) return;
  level.adventureTime += dt;
  const t = level.adventureTime;
  updateAdventureBarrels(dt);
  updateAdventureRoutes(dt);
  for (const o of level.obstacles) {
    if (o.kind === "cargo") {
      const angle =
        Math.sin(((t + (o.offset || 0)) * Math.PI * 2) / o.period) * o.range;
      o.px = o.x + Math.sin(angle) * o.len;
      o.py = o.y + Math.cos(angle) * o.len;
      const closestX = Math.max(
        player.x + 4,
        Math.min(player.x + player.w - 4, o.px),
      );
      const closestY = Math.max(
        player.y + 3,
        Math.min(player.y + player.h - 3, o.py),
      );
      if (Math.hypot(closestX - o.px, closestY - o.py) < o.w * 0.43)
        hurtPlayer("ჩამოკიდებული ტვირთი!", "trap");
    } else if (o.kind === "crawl" || o.kind === "crate") {
      // Solid beam: crouching gives 12px headroom; standing is blocked,
      // rather than costing health. A jump over the beam is also possible.
      if (overlap(player, o)) {
        if (player.vy >= 0 && player.y + player.h - player.vy <= o.y + 8) {
          player.y = o.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else {
          player.x =
            player.x + player.w / 2 < o.x + o.w / 2
              ? o.x - player.w
              : o.x + o.w;
          player.vx = 0;
        }
      }
    } else if (o.kind === "teeth" || o.kind === "press") {
      const cycle = ((t + (o.offset || 0)) % o.period) / o.period;
      o.warning = cycle >= 0.43 && cycle < 0.63;
      o.active = cycle >= 0.63 && cycle < 0.83;
      if (o.kind === "teeth") {
        if (o.active && overlap(player, o))
          hurtPlayer("იატაკის ხაფანგი!", "trap");
      } else {
        const travel = o.floorY - o.h - o.y;
        const progress =
          cycle < 0.63
            ? 0
            : cycle < 0.71
              ? (cycle - 0.63) / 0.08
              : cycle < 0.83
                ? 1
                : Math.max(0, 1 - (cycle - 0.83) / 0.17);
        o.pressY = o.y + travel * progress;
        if (
          progress > 0 &&
          overlap(player, { x: o.x, y: o.pressY, w: o.w, h: o.h })
        )
          hurtPlayer("ქვის პრესი!", "trap");
      }
    } else if (o.kind === "rail") {
      o.px =
        o.x +
        (o.to - o.x) * (0.5 - 0.5 * Math.cos((t * Math.PI * 2) / o.period));
      if (
        Math.hypot(
          player.x + player.w / 2 - o.px,
          player.y + player.h / 2 - o.y,
        ) <
        o.r + Math.min(player.w, player.h) * 0.36
      )
        hurtPlayer("მოძრავი ხერხი!", "trap");
    } else if (o.kind === "pulse") {
      const cycle = (t + (o.offset || 0)) % o.period;
      o.active = cycle >= o.period * 0.5 && cycle < o.period * 0.83;
      if (o.active && overlap(player, o))
        hurtPlayer("ენერგიის ბარიერი!", "trap");
    } else if (o.kind === "dart") {
      const cycle = t % o.period,
        burst = Math.floor(t / o.period);
      if (
        cycle > 750 &&
        cycle < 1050 &&
        o.lastBurst !== burst &&
        Math.abs(player.x - o.x) < 950
      ) {
        o.lastBurst = burst;
        level.trapShots.push({
          x: o.x,
          y: o.y + 16,
          vx: (o.dir || -1) * 6.5,
          life: 2100,
        });
        beep(120, 0.06, "triangle", 0.025);
      }
    } else if (o.kind === "rock") {
      if (
        o.phase === "idle" &&
        Math.abs(player.x + player.w / 2 - o.x - o.w / 2) < 170
      ) {
        o.phase = "warning";
        o.timer = 0;
      }
      if (o.phase === "warning") {
        o.timer += dt;
        if (o.timer > 850) {
          o.phase = "fall";
          o.velocity = 0;
        }
      }
      if (o.phase === "fall") {
        o.velocity += (0.6 * dt) / 16.67;
        o.dropY += (o.velocity * dt) / 16.67;
        if (overlap(player, { x: o.x, y: o.dropY, w: o.w, h: o.h }))
          hurtPlayer("ჩამოვარდნილი ქვა!", "trap");
        if (o.dropY + o.h >= o.floorY) {
          o.dropY = o.floorY - o.h;
          o.phase = "spent";
          o.timer = 0;
          spawnParticles(o.x + 24, o.floorY, "#9e9482", 9, 1);
          if (Math.abs(player.x - o.x) < 700) shake(3);
        }
      }
      if (o.phase === "spent") {
        o.timer += dt;
        if (o.timer > 4000) {
          o.phase = "idle";
          o.dropY = o.y;
        }
      }
    }
  }
  for (let i = level.trapShots.length - 1; i >= 0; i--) {
    const shot = level.trapShots[i];
    shot.x += (shot.vx * dt) / 16.67;
    shot.life -= dt;
    if (overlap(player, { x: shot.x - 10, y: shot.y - 3, w: 20, h: 6 })) {
      hurtPlayer("სალოცავის ისარი!", "trap");
      shot.life = 0;
    }
    if (shot.life <= 0) level.trapShots.splice(i, 1);
  }
  for (const b of level.switches) {
    if (
      !b.pressed &&
      overlap(player, { x: b.x - 8, y: b.y - 54, w: b.w + 16, h: 74 })
    ) {
      b.pressed = true;
      const door = level.doors.find((d) => d.id === b.id);
      if (door) door.open = true;
      sfxBell();
      addFloatingText(b.x, b.y - 70, "GATE OPEN", "#b9d5b2");
    }
  }
  for (const d of level.doors) {
    if (!d.open && overlap(player, d)) {
      player.x =
        player.x + player.w / 2 < d.x + d.w / 2 ? d.x - player.w : d.x + d.w;
      player.vx = 0;
    }
  }
  for (const r of level.relics) {
    if (!r.taken && overlap(player, r)) {
      r.taken = true;
      level.relicCount++;
      addScore(300);
      sfxBell();
      addFloatingText(
        r.x,
        r.y - 20,
        `RELIC ${level.relicCount}/3  +300`,
        "#e8c17e",
      );
      spawnParticles(r.x + 13, r.y + 16, "#e8c17e", 12, 1);
    }
  }
  for (const cache of level.supplyCaches) {
    if (!cache.taken && overlap(player, cache)) {
      cache.taken = true;
      if (cache.weapon && state.equippedSkin !== "lasha") {
        player.weaponMode = cache.weapon;
        level.__cpWeapon = cache.weapon;
      }
      const max = state.upgrades.maxHp ? 10 : 8,
        full = state.lives >= max;
      if (full) player.hasShield = true;
      else state.lives++;
      sfxPowerup();
      addFloatingText(
        cache.x,
        cache.y - 20,
        cache.weapon
          ? "PLASMA + SUPPLIES"
          : full
            ? "SHIELD READY"
            : "HEALTH +1",
        "#a7cfac",
      );
    }
  }
  if (level.bossArena && finalBoss.awakened && !finalBoss.dead) {
    player.x = Math.max(
      level.bossArena.start,
      Math.min(level.bossArena.end - player.w, player.x),
    );
  }
}

function drawEndgameTerrain() {
  const scene = level.scene,
    top = scene.surface,
    stone = scene.stone;
  ctx.save();
  for (const p of level.plats) {
    if (p.adventureBridge) {
      drawAdventureBridge(p);
      continue;
    }
    const x = p.x - camX;
    if (x + p.w < 0 || x > W) continue;
    const left = Math.max(x, -20),
      right = Math.min(x + p.w, W + 20),
      bottom = p.y + p.h;
    ctx.fillStyle = stone;
    ctx.beginPath();
    ctx.moveTo(left, p.y);
    ctx.lineTo(right, p.y);
    ctx.lineTo(right, bottom - 6);
    if (p.h < 80) {
      for (let k = right; k > left; k -= 36)
        ctx.lineTo(k, bottom + ((Math.floor((k + camX) / 36) % 3) - 1) * 9);
    } else ctx.lineTo(left, bottom);
    ctx.lineTo(left, p.y);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,.16)";
    ctx.fillRect(left, p.y + 12, right - left, Math.max(0, p.h - 12));
    ctx.fillStyle = top;
    ctx.fillRect(left, p.y, right - left, 5);
    ctx.fillStyle = "rgba(255,255,255,.22)";
    ctx.fillRect(left, p.y, right - left, 1);
    ctx.strokeStyle = "rgba(12,20,23,.4)";
    ctx.lineWidth = 2;
    for (
      let k = Math.ceil((left + camX) / 68) * 68 - camX;
      k < right;
      k += 68
    ) {
      ctx.beginPath();
      ctx.moveTo(k, p.y + 10);
      ctx.lineTo(k - 6, p.y + 26);
      ctx.lineTo(k + 14, p.y + 36);
      ctx.stroke();
    }
    if (level.musicTrack === "jungle") {
      ctx.strokeStyle = "#729b67";
      ctx.lineWidth = 2;
      for (
        let k = Math.ceil((left + camX) / 23) * 23 - camX;
        k < right;
        k += 23
      ) {
        ctx.beginPath();
        ctx.moveTo(k, p.y);
        ctx.lineTo(k - 3, p.y - 5);
        ctx.lineTo(k + 2, p.y - 2);
        ctx.stroke();
      }
      if (p.h < 80) {
        ctx.strokeStyle = "#496f4d";
        for (let k = left + 30; k < right; k += 91) {
          ctx.beginPath();
          ctx.moveTo(k, bottom - 4);
          ctx.quadraticCurveTo(k - 12, bottom + 19, k + 3, bottom + 34);
          ctx.stroke();
        }
      }
    }
    if (p.vx) {
      ctx.fillStyle = scene.accent;
      ctx.fillRect(left + 8, p.y + 10, Math.min(28, right - left - 8), 3);
    }
  }
  ctx.restore();
}

function drawEndgameBackdrop() {
  const scene = level.scene,
    theme = level.musicTrack;
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, scene.sky[0]);
  gradient.addColorStop(0.65, scene.sky[1]);
  gradient.addColorStop(1, scene.sky[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  if (theme === "jungle") {
    for (let layer = 0; layer < 3; layer++) {
      const spacing = layer === 0 ? 215 : layer === 1 ? 143 : 293,
        shift = camX * (0.035 + layer * 0.055);
      ctx.fillStyle = [
        "rgba(43,81,65,.32)",
        "rgba(18,56,46,.4)",
        "rgba(10,37,35,.55)",
      ][layer];
      for (
        let i = Math.floor(shift / spacing) - 1;
        i < Math.ceil((shift + W) / spacing) + 1;
        i++
      ) {
        const x = i * spacing - shift,
          h = 220 + (Math.sin(i * 4.3) + 1) * 70,
          y = GROUND_Y - 15;
        ctx.beginPath();
        ctx.moveTo(x - 12, y);
        ctx.lineTo(x + 8, y - h);
        ctx.lineTo(x + 27, y - h + 3);
        ctx.lineTo(x + 36, y);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - 95, y - h + 42);
        ctx.lineTo(x - 57, y - h - 12);
        ctx.lineTo(x - 29, y - h - 19);
        ctx.lineTo(x - 7, y - h - 52);
        ctx.lineTo(x + 36, y - h - 35);
        ctx.lineTo(x + 66, y - h - 45);
        ctx.lineTo(x + 114, y - h + 28);
        ctx.lineTo(x + 46, y - h + 52);
        ctx.lineTo(x - 26, y - h + 38);
        ctx.fill();
      }
    }
    ctx.fillStyle = "rgba(230,222,164,.035)";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 340 - 40, 0);
      ctx.lineTo(i * 340 + 90, 0);
      ctx.lineTo(i * 340 + 330, H);
      ctx.lineTo(i * 340 + 120, H);
      ctx.fill();
    }
  } else if (theme === "neon") {
    ctx.fillStyle = "rgba(239,200,162,.23)";
    ctx.beginPath();
    ctx.arc(W * 0.74, 100, 38, 0, Math.PI * 2);
    ctx.fill();
    for (let layer = 0; layer < 2; layer++) {
      const spacing = layer ? 133 : 201,
        shift = camX * (layer ? 0.13 : 0.05);
      for (
        let i = Math.floor(shift / spacing) - 1;
        i < Math.ceil((shift + W) / spacing) + 1;
        i++
      ) {
        const x = i * spacing - shift,
          h = 120 + ((((i * 97) % 145) + 145) % 145),
          y = GROUND_Y;
        ctx.fillStyle = layer ? "#192a3b" : "#30414e";
        ctx.fillRect(x, y - h, spacing - 11, h);
        ctx.fillRect(x + 14, y - h - 12, spacing - 47, 12);
        if (layer) {
          ctx.strokeStyle = "#44575e";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + 21, y - h);
          ctx.lineTo(x + 21, y - h - 38);
          ctx.stroke();
          ctx.fillStyle = "rgba(205,164,126,.4)";
          for (let r = 0; r < Math.floor(h / 32); r++)
            for (let c = 0; c < 3; c++) {
              if ((r + c + i) % 3 === 0)
                ctx.fillRect(x + 17 + c * 28, y - h + 18 + r * 32, 5, 8);
            }
        }
      }
    }
  } else if (theme === "crystal") {
    ctx.fillStyle = "#161b27";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    for (let x = W; x >= 0; x -= 47) {
      const index = Math.floor((x + camX * 0.08) / 47);
      ctx.lineTo(x, 32 + Math.abs(Math.sin(index * 1.9)) * 90);
    }
    ctx.fill();
    for (let layer = 0; layer < 2; layer++) {
      const spacing = layer ? 197 : 350,
        shift = camX * (layer ? 0.12 : 0.04);
      ctx.fillStyle = layer ? "rgba(45,45,63,.65)" : "rgba(81,74,90,.35)";
      for (
        let i = Math.floor(shift / spacing) - 1;
        i < Math.ceil((shift + W) / spacing) + 1;
        i++
      ) {
        const x = i * spacing - shift,
          h = 90 + (Math.sin(i * 2.3) + 1) * 70;
        ctx.beginPath();
        ctx.moveTo(x - 30, GROUND_Y + 60);
        ctx.lineTo(x + 30, GROUND_Y - h);
        ctx.lineTo(x + 55, GROUND_Y - h - 25);
        ctx.lineTo(x + 70, GROUND_Y - h * 0.55);
        ctx.lineTo(x + 150, GROUND_Y + 60);
        ctx.fill();
      }
    }
    ctx.fillStyle = "rgba(142,181,187,.04)";
    ctx.beginPath();
    ctx.moveTo(W * 0.6, 0);
    ctx.lineTo(W * 0.7, 0);
    ctx.lineTo(W * 0.96, H);
    ctx.lineTo(W * 0.38, H);
    ctx.fill();
  } else if (theme === "sky") {
    for (let layer = 0; layer < 3; layer++) {
      ctx.fillStyle = [
        "rgba(208,222,218,.45)",
        "rgba(224,233,224,.4)",
        "rgba(248,238,210,.2)",
      ][layer];
      const spacing = 290 + layer * 110,
        shift = camX * (0.04 + layer * 0.04);
      for (
        let i = Math.floor(shift / spacing) - 1;
        i < Math.ceil((shift + W) / spacing) + 1;
        i++
      ) {
        const x = i * spacing - shift,
          y = 340 + layer * 65;
        ctx.beginPath();
        ctx.moveTo(x - 80, y + 60);
        ctx.bezierCurveTo(x - 35, y - 20, x + 15, y + 10, x + 50, y - 8);
        ctx.bezierCurveTo(x + 90, y - 44, x + 128, y - 15, x + 150, y + 15);
        ctx.bezierCurveTo(x + 195, y - 15, x + 210, y + 44, x + 270, y + 60);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.fillStyle = "rgba(69,110,128,.2)";
    for (let i = 0; i < 3; i++) {
      const x = i * 440 + 110 - camX * 0.07;
      ctx.fillRect(x, 310, 24, 160);
      ctx.fillRect(x + 105, 325, 22, 145);
      ctx.fillRect(x - 10, 310, 146, 12);
    }
  } else {
    for (let layer = 0; layer < 3; layer++) {
      const spacing = layer ? 357 : 517,
        shift = camX * (0.025 + layer * 0.05),
        y = GROUND_Y + 80;
      ctx.fillStyle =
        theme === "volcano"
          ? ["rgba(64,41,41,.25)", "rgba(54,37,39,.35)", "rgba(37,29,35,.5)"][
              layer
            ]
          : ["rgba(58,90,106,.25)", "rgba(27,57,72,.35)", "rgba(17,39,53,.5)"][
              layer
            ];
      for (
        let i = Math.floor(shift / spacing) - 1;
        i < Math.ceil((shift + W) / spacing) + 1;
        i++
      ) {
        const x = i * spacing - shift,
          h = 120 + Math.abs(Math.sin(i * 2.37)) * 180;
        ctx.beginPath();
        ctx.moveTo(x - 130, y);
        ctx.lineTo(x + 20, y - h);
        ctx.lineTo(x + 60, y - h + 37);
        ctx.lineTo(x + 110, y - h + 12);
        ctx.lineTo(x + 230, y);
        ctx.closePath();
        ctx.fill();
      }
    }
    if (theme === "finale") {
      ctx.strokeStyle = "rgba(186,214,211,.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(W * 0.7, 150, 73, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(210,226,214,.24)";
      for (let i = 0; i < 23; i++)
        ctx.fillRect((i * 173) % W, 80 + ((i * 71) % 250), 2, 2);
    }
  }
  ctx.restore();
}

function drawAuthoredSetPieces() {
  ctx.save();
  for (const p of level.setPieces) {
    const x = p.x - camX;
    if (x + p.w < -100 || x > W + 100) continue;
    const y = p.y,
      w = p.w,
      h = p.h;
    if (p.type === "jungle_tree") {
      ctx.fillStyle = "#4b4735";
      ctx.beginPath();
      ctx.moveTo(x + w * 0.38, y);
      ctx.lineTo(x + w * 0.48, y - h * 0.61);
      ctx.lineTo(x + w * 0.55, y - h * 0.62);
      ctx.lineTo(x + w * 0.6, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#323e2f";
      ctx.beginPath();
      ctx.moveTo(x + w * 0.5, y);
      ctx.lineTo(x + w * 0.52, y - h * 0.6);
      ctx.lineTo(x + w * 0.55, y - h * 0.62);
      ctx.lineTo(x + w * 0.6, y);
      ctx.fill();
      ctx.strokeStyle = "#4b4735";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.5, y - h * 0.38);
      ctx.lineTo(x + w * 0.28, y - h * 0.61);
      ctx.moveTo(x + w * 0.51, y - h * 0.47);
      ctx.lineTo(x + w * 0.8, y - h * 0.65);
      ctx.stroke();
      const clusters = [
        { cx: 0.25, cy: 0.66, s: 0.3, color: "#294d37" },
        { cx: 0.55, cy: 0.77, s: 0.36, color: "#345b3c" },
        { cx: 0.8, cy: 0.66, s: 0.27, color: "#274932" },
      ];
      for (const c of clusters) {
        const cx = x + w * c.cx,
          cy = y - h * c.cy,
          r = w * c.s;
        ctx.fillStyle = c.color;
        ctx.beginPath();
        const points = [
          [-1, 0.05],
          [-0.86, -0.33],
          [-0.57, -0.46],
          [-0.4, -0.79],
          [-0.03, -0.68],
          [0.13, -0.92],
          [0.38, -0.66],
          [0.72, -0.6],
          [0.79, -0.25],
          [1, 0.12],
          [0.75, 0.35],
          [0.38, 0.36],
          [0.19, 0.51],
          [-0.17, 0.3],
          [-0.6, 0.39],
        ];
        points.forEach(([px, py], i) =>
          i
            ? ctx.lineTo(cx + px * r, cy + py * r * 0.6)
            : ctx.moveTo(cx + px * r, cy + py * r * 0.6),
        );
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#557346";
        for (let i = 0; i < 6; i++) {
          const px = cx + r * (-0.57 + i * 0.2),
            py = cy - r * 0.13 + Math.sin(i * 1.9) * r * 0.14;
          ctx.fillRect(px, py, 7 + (i % 3) * 5, 3);
        }
      }
      ctx.strokeStyle = "#587b4b";
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + w * (0.25 + i * 0.21), y - h * 0.54);
        ctx.bezierCurveTo(
          x + w * (0.23 + i * 0.2),
          y - h * 0.34,
          x + w * (0.31 + i * 0.2),
          y - h * 0.25,
          x + w * (0.28 + i * 0.2),
          y - h * 0.12,
        );
        ctx.stroke();
      }
      ctx.fillStyle = "#476044";
      ctx.beginPath();
      ctx.moveTo(x + w * 0.18, y);
      ctx.lineTo(x + w * 0.47, y - 20);
      ctx.lineTo(x + w * 0.67, y);
      ctx.fill();
    } else if (p.type === "neon_tower") {
      ctx.fillStyle = "#243444";
      ctx.fillRect(x + w * 0.16, y - h, w * 0.72, h);
      ctx.fillStyle = "#1a2938";
      ctx.fillRect(x + w * 0.58, y - h + 36, w * 0.3, h - 36);
      ctx.fillStyle = "#40515b";
      ctx.fillRect(x + w * 0.12, y - h - 8, w * 0.77, 8);
      ctx.fillStyle = "#2a3b49";
      ctx.fillRect(x + w * 0.27, y - h - 31, w * 0.28, 24);
      ctx.strokeStyle = "#75818a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.71, y - h - 8);
      ctx.lineTo(x + w * 0.71, y - h - 57);
      ctx.moveTo(x + w * 0.62, y - h - 39);
      ctx.lineTo(x + w * 0.8, y - h - 39);
      ctx.stroke();
      for (let r = 0; r < Math.floor(h / 34) - 1; r++)
        for (let c = 0; c < 4; c++) {
          ctx.fillStyle = (r * 3 + c + p.seed) % 4 ? "#99a8a2" : "#dfb38e";
          ctx.globalAlpha = (r + c) % 3 ? 0.4 : 0.75;
          ctx.fillRect(x + w * 0.23 + c * w * 0.13, y - h + 22 + r * 34, 8, 12);
          ctx.fillStyle = "#162533";
          ctx.fillRect(x + w * 0.23 + c * w * 0.13, y - h + 29 + r * 34, 8, 2);
        }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#77828a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let r = 1; r < 6; r++) {
        const yy = y - h + r * 45;
        ctx.moveTo(x + w * 0.66, yy);
        ctx.lineTo(x + w * 0.93, yy);
        ctx.lineTo(x + w * 0.82, yy + 45);
      }
      ctx.stroke();
      ctx.fillStyle = "#162b36";
      ctx.fillRect(x + w * 0.08, y - h * 0.68, w * 0.72, 26);
      ctx.strokeStyle = "#97b3b8";
      ctx.strokeRect(x + w * 0.08, y - h * 0.68, w * 0.72, 26);
      ctx.fillStyle = "#c3ccbb";
      ctx.font = "600 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.label, x + w * 0.44, y - h * 0.68 + 17);
      ctx.strokeStyle = "rgba(168,185,183,.4)";
      ctx.beginPath();
      ctx.moveTo(x + w * 0.9, y - h + 5);
      ctx.quadraticCurveTo(x + w * 1.3, y - h + 70, x + w * 1.65, y - h + 10);
      ctx.stroke();
      ctx.fillStyle = "#4d6b6a";
      ctx.fillRect(x + w * 0.15, y - 60, w * 0.43, 8);
      ctx.fillStyle = "#213a42";
      ctx.fillRect(x + w * 0.15, y - 52, w * 0.43, 52);
    } else if (p.type === "crystal_cluster") {
      const colors = ["#586b80", "#7d91a0", "#92adaf", "#58637b"];
      for (let i = 0; i < 5; i++) {
        const xx = x + w * (0.05 + i * 0.17),
          hh = h * (0.5 + ((i * 7 + p.seed) % 5) * 0.1),
          ww = w * (0.18 - (i % 2) * 0.03);
        ctx.fillStyle = colors[(i + p.seed) % 4];
        ctx.beginPath();
        ctx.moveTo(xx, y);
        ctx.lineTo(xx + ww * 0.2, y - hh * 0.73);
        ctx.lineTo(xx + ww * 0.48, y - hh);
        ctx.lineTo(xx + ww * 0.82, y - hh * 0.67);
        ctx.lineTo(xx + ww, y);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(222,234,217,.17)";
        ctx.beginPath();
        ctx.moveTo(xx + ww * 0.48, y - hh);
        ctx.lineTo(xx + ww * 0.56, y);
        ctx.lineTo(xx + ww * 0.1, y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#b1c6bd";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xx + ww * 0.48, y - hh);
        ctx.lineTo(xx + ww * 0.51, y - hh * 0.24);
        ctx.stroke();
      }
    } else if (p.type === "volcano_ridge") {
      ctx.fillStyle = "#3d3436";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w * 0.16, y - h * 0.55);
      ctx.lineTo(x + w * 0.35, y - h * 0.43);
      ctx.lineTo(x + w * 0.57, y - h);
      ctx.lineTo(x + w * 0.66, y - h * 0.96);
      ctx.lineTo(x + w * 0.86, y - h * 0.46);
      ctx.lineTo(x + w, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#2f2d34";
      ctx.beginPath();
      ctx.moveTo(x + w * 0.66, y - h * 0.96);
      ctx.lineTo(x + w * 0.61, y - h * 0.36);
      ctx.lineTo(x + w * 0.89, y);
      ctx.lineTo(x + w, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#9b624c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.58, y - h * 0.94);
      ctx.lineTo(x + w * 0.47, y - h * 0.6);
      ctx.lineTo(x + w * 0.5, y - h * 0.45);
      ctx.lineTo(x + w * 0.37, y - h * 0.16);
      ctx.stroke();
    } else {
      const cosmic = p.type === "cosmic_gate";
      ctx.fillStyle = cosmic ? "#35434d" : "#697c77";
      const cw = w * 0.12,
        left = x + w * 0.2,
        right = x + w * 0.73;
      for (const xx of [left, right]) {
        ctx.fillRect(xx, y - h * 0.62, cw, h * 0.62);
        ctx.fillStyle = cosmic ? "#526671" : "#a1aa94";
        ctx.fillRect(xx - 5, y - h * 0.65, cw + 10, 12);
        ctx.fillRect(xx - 8, y - 10, cw + 16, 10);
        ctx.fillStyle = cosmic ? "#35434d" : "#697c77";
        ctx.strokeStyle = cosmic ? "#708995" : "#52685c";
        ctx.lineWidth = 1;
        for (let j = 0; j < 5; j++) {
          ctx.beginPath();
          ctx.moveTo(xx, y - h * 0.52 + j * h * 0.1);
          ctx.lineTo(xx + cw, y - h * 0.52 + j * h * 0.1);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = cosmic ? "#708995" : "#9da891";
      ctx.lineWidth = cosmic ? 9 : 16;
      ctx.beginPath();
      ctx.moveTo(left + cw * 0.5, y - h * 0.62);
      ctx.quadraticCurveTo(
        x + w * 0.51,
        y - h * 0.98,
        right + cw * 0.5,
        y - h * 0.62,
      );
      ctx.stroke();
      ctx.strokeStyle = cosmic ? "rgba(193,212,204,.3)" : "#435c51";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left + cw * 0.5, y - h * 0.62);
      ctx.quadraticCurveTo(
        x + w * 0.51,
        y - h * 0.98,
        right + cw * 0.5,
        y - h * 0.62,
      );
      ctx.stroke();
      if (cosmic) {
        ctx.fillStyle = "rgba(187,209,204,.08)";
        ctx.beginPath();
        ctx.ellipse(
          x + w * 0.52,
          y - h * 0.35,
          w * 0.22,
          h * 0.26,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      } else {
        ctx.fillStyle = "#66846b";
        ctx.fillRect(left + cw - 4, y - h * 0.47, 4, h * 0.16);
      }
    }
  }
  ctx.restore();
}

function drawEndgameHUD() {
  ctx.save();
  const accent = level.scene.accent;
  ctx.fillStyle = "rgba(12,23,31,.82)";
  ctx.fillRect(0, 0, W, 82);
  ctx.fillStyle = "rgba(202,219,207,.16)";
  ctx.fillRect(0, 81, W, 1);
  ctx.textAlign = "left";
  ctx.fillStyle = "#dbe3d7";
  ctx.font = "600 13px sans-serif";
  ctx.fillText(
    `EP.${state.levelIndex + 1}  ${level.name.split("—")[1].trim()}`,
    20,
    25,
  );
  const max = state.upgrades.maxHp ? 10 : 8;
  for (let i = 0; i < max; i++) {
    ctx.fillStyle = i < state.lives ? "#bbccc0" : "#3c4e50";
    ctx.fillRect(20 + i * 13, 40, 8, 13);
  }
  ctx.fillStyle = "#94a9a4";
  ctx.font = "10px sans-serif";
  ctx.fillText(`${state.lives}/${max}  HEALTH`, 20 + max * 13 + 8, 51);
  ctx.fillStyle = "#384e53";
  ctx.fillRect(20, 62, 112, 3);
  ctx.fillStyle = accent;
  ctx.fillRect(20, 62, (112 * player.stamina) / player.maxStamina, 3);
  const progress = Math.max(0, Math.min(1, player.x / (level.width - 160))),
    px = W / 2 - 154;
  ctx.fillStyle = "#384e53";
  ctx.fillRect(px, 39, 308, 3);
  ctx.fillStyle = accent;
  ctx.fillRect(px, 39, 308 * progress, 3);
  ctx.fillStyle = "#c2cdc4";
  ctx.font = "600 11px sans-serif";
  ctx.textAlign = "center";
  if (level.bossArena && finalBoss.awakened && !finalBoss.dead) {
    const ratio = Math.max(0, finalBoss.hp / finalBoss.maxHp),
      phase = ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
    ctx.fillText("THE WORLD EATER", W / 2, 26);
    ctx.fillStyle = "#324b51";
    ctx.fillRect(px, 39, 308, 7);
    ctx.fillStyle = phase === 3 ? "#e3ac7e" : "#a7c7c8";
    ctx.fillRect(px, 39, 308 * ratio, 7);
    ctx.fillStyle = "#bdccc5";
    ctx.font = "10px sans-serif";
    ctx.fillText(
      `PHASE ${phase} / 3   ·   ${Math.ceil(finalBoss.hp)} HP`,
      W / 2,
      69,
    );
  } else ctx.fillText(`${Math.floor(progress * 100)}% OF JOURNEY`, W / 2, 26);
  for (const [x, label] of [
    [W - 176, bgmMuted ? "MUTED" : "MUSIC"],
    [W - 90, "PAUSE"],
  ]) {
    ctx.fillStyle = "rgba(161,187,182,.08)";
    ctx.fillRect(x, 10, 78, 34);
    ctx.strokeStyle = "#617a7d";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, 10, 78, 34);
    ctx.fillStyle = "#c6d4cd";
    ctx.font = "600 11px sans-serif";
    ctx.fillText(label, x + 39, 31);
  }
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(12,23,31,.78)";
  ctx.fillRect(16, H - 43, 280, 29);
  ctx.fillStyle = "#b9cac0";
  ctx.font = "600 10px sans-serif";
  ctx.fillText(
    `${player.weaponMode.toUpperCase()}   /   SCORE ${state.score}   /   COINS ${state.coinsCollected}`,
    27,
    H - 24,
  );
  if (player.isSwinging) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#e5bd7b";
    ctx.font = "600 12px sans-serif";
    ctx.fillText("JUMP / SPACE TO RELEASE THE ROPE", W / 2, H - 61);
  }
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(219,226,209,.67)";
  ctx.font = "10px sans-serif";
  ctx.fillText(
    "MOVE  ← →    JUMP  SPACE    DUCK  ↓    FIRE  F    RUN  SHIFT",
    W - 22,
    H - 24,
  );
  ctx.restore();
}

function drawEndgameScenery() {
  const scene = level.scene;
  for (const fall of scene.waterfalls || []) {
    const x = fall.x - camX;
    if (x + fall.w < 0 || x > W) continue;
    ctx.fillStyle = "rgba(149,199,201,.55)";
    ctx.fillRect(x, GROUND_Y - 250, fall.w, 380);
    ctx.fillStyle = "rgba(221,241,228,.3)";
    for (let i = 0; i < 4; i++)
      ctx.fillRect(
        x + 8 + (i * fall.w) / 5,
        GROUND_Y - 240 + ((level.adventureTime * 0.06 + i * 57) % 230),
        3,
        95,
      );
  }
  for (const mark of scene.landmarks || []) {
    const x = mark.x - camX;
    if (x < -400 || x > W + 100) continue;
    const y = GROUND_Y;
    ctx.save();
    ctx.fillStyle = scene.stone;
    ctx.strokeStyle = scene.accent;
    ctx.lineWidth = 3;
    if (mark.style === "mill" || mark.style === "clock") {
      ctx.fillRect(x + 35, y - 240, 190, 240);
      ctx.beginPath();
      ctx.moveTo(x + 15, y - 240);
      ctx.lineTo(x + 130, y - 310);
      ctx.lineTo(x + 245, y - 240);
      ctx.fill();
      ctx.translate(x + 130, y - 155);
      ctx.rotate(mark.style === "mill" ? level.adventureTime * 0.0002 : 0);
      ctx.strokeStyle = scene.surface;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, 0, 64, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 62);
        ctx.stroke();
      }
    } else if (mark.style === "crane") {
      ctx.fillRect(x + 30, y - 290, 20, 290);
      ctx.fillRect(x - 50, y - 300, 420, 16);
      ctx.strokeStyle = scene.surface;
      ctx.lineWidth = 2;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(x - 45 + i * 55, y - 284);
        ctx.lineTo(x - 18 + i * 55, y - 325);
        ctx.lineTo(x + 10 + i * 55, y - 284);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(x + 240, y - 290);
      ctx.lineTo(x + 240, y - 100);
      ctx.stroke();
    } else if (mark.style === "beacon") {
      ctx.fillRect(x + 50, y - 350, 90, 350);
      ctx.fillStyle = scene.surface;
      ctx.fillRect(x + 35, y - 380, 120, 36);
      ctx.fillStyle = "rgba(217,234,217,.13)";
      ctx.beginPath();
      ctx.moveTo(x + 92, y - 360);
      ctx.lineTo(x - 450, y - 540);
      ctx.lineTo(x - 450, y - 240);
      ctx.fill();
    } else {
      ctx.fillRect(x, y - 150, 42, 150);
      ctx.fillRect(x + 210, y - 150, 42, 150);
      ctx.fillRect(x - 12, y - 174, 275, 24);
      ctx.strokeStyle = scene.surface;
      ctx.beginPath();
      ctx.moveTo(x + 10, y - 165);
      ctx.lineTo(x + 125, y - 245);
      ctx.lineTo(x + 242, y - 165);
      ctx.stroke();
      if (mark.style === "mine") {
        ctx.strokeStyle = "#785f49";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x - 8, y);
        ctx.lineTo(x + 30, y - 165);
        ctx.moveTo(x + 260, y);
        ctx.lineTo(x + 210, y - 165);
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.save();
    ctx.font = "600 10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = scene.accent;
    ctx.fillText(mark.title, x + 18, y - 184);
    ctx.restore();
  }
}

function drawEndgameObjects() {
  if (!level.endgameDesign) return;
  const t = level.adventureTime || 0;
  drawAdventureBarrelLanes();
  drawAdventureRoutes();
  ctx.save();
  for (const o of level.obstacles) {
    const reach = o.kind === "rail" ? o.to : o.x;
    if (reach - camX < -140 || o.x - camX > W + 140) continue;
    const x = o.x - camX;
    if (o.kind === "cargo") {
      const angle =
        Math.sin(((t + (o.offset || 0)) * Math.PI * 2) / o.period) * o.range;
      const px = o.x + Math.sin(angle) * o.len - camX,
        py = o.y + Math.cos(angle) * o.len;
      ctx.strokeStyle = "#9aaca5";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, o.y);
      ctx.lineTo(px - 15, py - 22);
      ctx.moveTo(x + 10, o.y);
      ctx.lineTo(px + 15, py - 22);
      ctx.stroke();
      ctx.fillStyle = level.scene.stone;
      ctx.fillRect(x - 20, o.y - 10, 48, 18);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-angle * 0.3);
      ctx.fillStyle = "#6b6253";
      ctx.fillRect(-24, -24, 48, 48);
      ctx.strokeStyle = "#b6a886";
      ctx.lineWidth = 4;
      ctx.strokeRect(-21, -21, 42, 42);
      ctx.beginPath();
      ctx.moveTo(-19, -19);
      ctx.lineTo(19, 19);
      ctx.moveTo(19, -19);
      ctx.lineTo(-19, 19);
      ctx.stroke();
      ctx.fillStyle = "#3a4445";
      ctx.fillRect(-26, 12, 52, 7);
      ctx.restore();
      ctx.strokeStyle = "rgba(217,195,145,.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 8]);
      ctx.beginPath();
      ctx.ellipse(
        x,
        GROUND_Y - 3,
        Math.sin(o.range) * o.len + 24,
        5,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (o.kind === "crate") {
      ctx.fillStyle = "#70563b";
      ctx.fillRect(x, o.y, o.w, o.h);
      ctx.strokeStyle = "#b2976e";
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 3, o.y + 3, o.w - 6, o.h - 6);
      ctx.beginPath();
      ctx.moveTo(x + 5, o.y + 5);
      ctx.lineTo(x + o.w - 5, o.y + o.h - 5);
      ctx.moveTo(x + o.w - 5, o.y + 5);
      ctx.lineTo(x + 5, o.y + o.h - 5);
      ctx.stroke();
      ctx.fillStyle = "#303c3c";
      for (const k of [7, o.w - 9]) {
        ctx.fillRect(x + k, o.y + 6, 3, 3);
        ctx.fillRect(x + k, o.y + o.h - 9, 3, 3);
      }
    } else if (o.kind === "crawl") {
      ctx.fillStyle = level.scene.stone;
      ctx.fillRect(x, o.y, o.w, o.h);
      ctx.fillStyle = level.scene.surface;
      ctx.fillRect(x, o.y, o.w, 6);
      ctx.strokeStyle = "rgba(225,219,195,.25)";
      for (let k = 14; k < o.w; k += 38) {
        ctx.beginPath();
        ctx.moveTo(x + k, o.y + 8);
        ctx.lineTo(x + k + 8, o.y + o.h - 6);
        ctx.stroke();
      }
      if (o.material === "roots") {
        ctx.strokeStyle = "#72876a";
        ctx.lineWidth = 4;
        for (let k = 20; k < o.w; k += 43) {
          ctx.beginPath();
          ctx.moveTo(x + k, o.y);
          ctx.bezierCurveTo(
            x + k - 16,
            o.y + 22,
            x + k + 23,
            o.y + 40,
            x + k + 9,
            o.y + o.h - 5,
          );
          ctx.stroke();
        }
        ctx.fillStyle = "#8d9f75";
        for (let k = 8; k < o.w; k += 24) ctx.fillRect(x + k, o.y - 3, 13, 5);
      } else if (o.material === "duct") {
        ctx.strokeStyle = "#8b9c99";
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 3, o.y + 3, o.w - 6, o.h - 6);
        ctx.fillStyle = "#27383e";
        for (let k = 14; k < o.w - 12; k += 12)
          ctx.fillRect(x + k, o.y + 18, 4, 30);
      } else {
        ctx.strokeStyle = "#64746e";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, o.y + 34);
        ctx.lineTo(x + o.w, o.y + 34);
        ctx.stroke();
        ctx.fillStyle = "rgba(12,24,30,.5)";
        ctx.fillRect(x + o.w * 0.63, o.y + 8, 3, 23);
      }
      ctx.fillStyle = "#dec79c";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("↓ DUCK", x + o.w / 2, o.y + o.h + 18);
    } else if (o.kind === "teeth") {
      ctx.fillStyle = "#253337";
      ctx.fillRect(x - 5, o.y + o.h - 5, o.w + 10, 8);
      ctx.fillStyle = o.warning ? "#e4b46a" : o.active ? "#d8b99a" : "#7b998c";
      ctx.fillRect(x, o.y + o.h - 9, o.w, 3);
      if (o.active)
        for (let k = 0; k < o.w; k += 14) {
          ctx.beginPath();
          ctx.moveTo(x + k, o.y + o.h);
          ctx.lineTo(x + k + 7, o.y);
          ctx.lineTo(x + k + 14, o.y + o.h);
          ctx.fill();
        }
      if (o.warning) {
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("↑", x + o.w / 2, o.y - 8);
      }
    } else if (o.kind === "press") {
      ctx.strokeStyle = "#5d6869";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x + 12, o.y - 100);
      ctx.lineTo(x + 12, o.pressY);
      ctx.moveTo(x + o.w - 12, o.y - 100);
      ctx.lineTo(x + o.w - 12, o.pressY);
      ctx.stroke();
      ctx.fillStyle = level.scene.stone;
      ctx.fillRect(x, o.pressY, o.w, o.h);
      ctx.fillStyle = "#87908b";
      ctx.fillRect(x, o.pressY + o.h - 10, o.w, 10);
      ctx.fillStyle = o.warning ? "rgba(229,177,99,.45)" : "rgba(22,30,34,.3)";
      ctx.fillRect(x - 6, o.floorY - 4, o.w + 12, 4);
      ctx.fillStyle = o.warning ? "#e4b46a" : "#9bb7a4";
      ctx.fillRect(x + o.w / 2 - 4, o.pressY + 20, 8, 8);
      if (o.warning) {
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("WAIT", x + o.w / 2, o.floorY - 22);
      }
    } else if (o.kind === "rail") {
      ctx.strokeStyle = "#697b7d";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, o.y);
      ctx.lineTo(o.to - camX, o.y);
      ctx.stroke();
      const px = (o.px === undefined ? o.x : o.px) - camX;
      ctx.save();
      ctx.translate(px, o.y);
      ctx.rotate(t * 0.004);
      ctx.fillStyle = "#adb8b8";
      ctx.strokeStyle = "#394449";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let k = 0; k < 24; k++) {
        const a = (k * Math.PI) / 12,
          r = k % 2 ? o.r * 0.7 : o.r;
        const xx = Math.cos(a) * r,
          yy = Math.sin(a) * r;
        if (!k) ctx.moveTo(xx, yy);
        else ctx.lineTo(xx, yy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#b97758";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (o.kind === "pulse") {
      const cycle = (t + (o.offset || 0)) % o.period,
        warning = cycle > o.period * 0.35 && cycle < o.period * 0.5;
      ctx.fillStyle = "#263a43";
      ctx.fillRect(x - 6, o.y - 8, o.w + 12, 12);
      ctx.fillRect(x - 6, o.y + o.h - 4, o.w + 12, 10);
      ctx.fillStyle = o.active ? "#f19d83" : warning ? "#edc47e" : "#94bcab";
      ctx.fillRect(x + 8, o.y - 5, 6, 6);
      if (o.active) {
        ctx.fillStyle = "rgba(241,157,131,.15)";
        ctx.fillRect(x - 6, o.y, o.w + 12, o.h);
        ctx.fillStyle = "#efb19c";
        ctx.fillRect(x + 8, o.y, 6, o.h);
      } else {
        ctx.strokeStyle = warning ? "#edc47e" : "rgba(200,225,216,.22)";
        ctx.setLineDash([4, 7]);
        ctx.beginPath();
        ctx.moveTo(x + 11, o.y);
        ctx.lineTo(x + 11, o.y + o.h);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    } else if (o.kind === "dart") {
      const warning = t % o.period < 750;
      ctx.fillStyle = "#384e48";
      ctx.fillRect(x + 7, o.y + 32, 16, 30);
      ctx.fillStyle = "#5e7166";
      ctx.fillRect(x, o.y, 30, 32);
      ctx.fillStyle = "#172725";
      ctx.fillRect(x + (o.dir === 1 ? 23 : 0), o.y + 12, 7, 9);
      ctx.fillStyle = warning ? "#e3b776" : "#97a493";
      ctx.fillRect(x + 12, o.y + 5, 6, 5);
      if (warning) {
        ctx.strokeStyle = "rgba(235,197,140,.4)";
        ctx.setLineDash([3, 10]);
        ctx.beginPath();
        ctx.moveTo(x + 15, o.y + 16);
        ctx.lineTo(x + 15 + o.dir * 170, o.y + 16);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    } else if (o.kind === "rock") {
      if (o.phase === "spent") continue;
      const y = o.dropY === undefined ? o.y : o.dropY,
        shake = o.phase === "warning" ? Math.sin(t * 0.045) * 3 : 0;
      ctx.fillStyle =
        o.phase === "warning" ? "rgba(234,184,114,.38)" : "rgba(11,19,24,.18)";
      ctx.beginPath();
      ctx.ellipse(x + 24, o.floorY - 2, 32, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#817d7a";
      ctx.beginPath();
      ctx.moveTo(x + 7 + shake, y);
      ctx.lineTo(x + 40 + shake, y + 3);
      ctx.lineTo(x + 48 + shake, y + 26);
      ctx.lineTo(x + 34 + shake, y + 42);
      ctx.lineTo(x + 4 + shake, y + 35);
      ctx.lineTo(x + shake, y + 15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#b6aaa0";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (o.phase === "warning") {
        ctx.fillStyle = "#e5b475";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("!", x + 24, o.floorY - 60);
      }
    }
  }
  for (const shot of level.trapShots || []) {
    ctx.fillStyle = "#e4c9a2";
    ctx.fillRect(shot.x - camX - 9, shot.y - 2, 18, 4);
  }
  for (const door of level.doors) {
    const x = door.x - camX;
    if (x < -80 || x > W + 80) continue;
    ctx.fillStyle = level.scene.stone;
    ctx.fillRect(x - 6, door.y - 10, door.w + 12, 10);
    if (!door.open) {
      ctx.fillStyle = "#4d6268";
      ctx.fillRect(x, door.y, door.w, door.h);
      ctx.strokeStyle = "#8eaba8";
      for (let k = 0; k < door.h; k += 28) {
        ctx.beginPath();
        ctx.moveTo(x, door.y + k);
        ctx.lineTo(x + door.w, door.y + k);
        ctx.stroke();
      }
      ctx.fillStyle = "#e3bb78";
      ctx.fillRect(x + 14, door.y + door.h * 0.5, 8, 18);
    }
  }
  for (const b of level.switches) {
    const x = b.x - camX;
    if (x < -80 || x > W + 80) continue;
    ctx.fillStyle = "#33494c";
    ctx.fillRect(x, b.y, b.w, b.h);
    ctx.fillStyle = b.pressed ? "#a1c9ac" : "#e6b878";
    ctx.fillRect(x + 5, b.y + (b.pressed ? 8 : 0), b.w - 10, 6);
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(b.pressed ? "OPEN" : "PRESS", x + b.w / 2, b.y - 8);
  }
  for (const r of level.relics) {
    if (r.taken) continue;
    const x = r.x - camX;
    if (x < -80 || x > W + 80) continue;
    const y = r.y + Math.sin(t * 0.003 + r.x) * 4;
    ctx.strokeStyle = "#e5bd7b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 13, y);
    ctx.lineTo(x + 26, y + 16);
    ctx.lineTo(x + 13, y + 32);
    ctx.lineTo(x, y + 16);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#e5bd7b";
    ctx.fillRect(x + 9, y + 12, 8, 8);
  }
  for (const c of level.supplyCaches) {
    if (c.taken) continue;
    const x = c.x - camX;
    if (x < -80 || x > W + 80) continue;
    ctx.fillStyle = "#596f5d";
    ctx.fillRect(x, c.y, c.w, c.h);
    ctx.strokeStyle = "#b0bea0";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, c.y, c.w, c.h);
    ctx.fillStyle = "#d5dbc0";
    ctx.fillRect(x + 16, c.y + 8, 8, 22);
    ctx.fillRect(x + 9, c.y + 15, 22, 8);
  }
  if (level.bossArena && finalBoss.awakened && !finalBoss.dead) {
    const x = level.bossArena.start - camX;
    ctx.fillStyle = "rgba(180,220,223,.25)";
    ctx.fillRect(x - 4, GROUND_Y - 300, 8, 300);
  }
  ctx.restore();
}

function drawEndgameChapter() {
  if (
    !level.endgameDesign ||
    (level.bossArena && finalBoss.awakened && !finalBoss.dead)
  )
    return;
  let chapter = level.sections[0];
  for (const s of level.sections) {
    if (player.x >= s.x) chapter = s;
  }
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "600 10px sans-serif";
  ctx.fillStyle = "rgba(218,228,223,.88)";
  ctx.fillText(
    `${chapter.title}   /   RELICS ${level.relicCount || 0} OF 3`,
    W / 2,
    70,
  );
  ctx.restore();
}

function updateEndgameBossAttacks(fb, dt) {
  fb.attackTimer += dt;
  const phase = fb.hp / fb.maxHp > 0.66 ? 1 : fb.hp / fb.maxHp > 0.33 ? 2 : 3;
  if (fb.pendingAttack) {
    const a = fb.pendingAttack;
    a.timer -= dt;
    if (a.timer <= 0) {
      const ox = fb.x + fb.w / 2,
        oy = fb.y + fb.h * 0.4;
      if (a.type === "volley") {
        const angle = Math.atan2(a.y - oy, a.x - ox);
        for (let i = -1; i <= 1; i++)
          fb.projectiles.push({
            x: ox,
            y: oy,
            vx: Math.cos(angle + i * 0.2) * 6,
            vy: Math.sin(angle + i * 0.2) * 6,
            life: 155,
            color: "#91c8d2",
            size: 8,
          });
      } else if (a.type === "wave") {
        for (const dir of [-1, 1])
          fb.projectiles.push({
            x: ox,
            y: GROUND_Y - 13,
            vx: dir * (phase === 3 ? 6 : 4.8),
            vy: 0,
            life: 170,
            color: "#e6b47f",
            size: 13,
          });
      } else {
        for (const x of a.targets)
          fb.projectiles.push({
            x,
            y: GROUND_Y - 350,
            vx: 0,
            vy: 5.2,
            life: 105,
            color: "#d6bd93",
            size: 13,
          });
      }
      spawnParticles(ox, oy, "#b7d4d5", 8, 1);
      fb.pendingAttack = null;
    }
  } else if (
    fb.attackTimer > (phase === 1 ? 2600 : phase === 2 ? 2300 : 2000)
  ) {
    fb.attackTimer = 0;
    fb.attackNumber++;
    const types =
      phase === 1 ? ["volley", "wave"] : ["volley", "meteor", "wave"];
    const type = types[(fb.attackNumber - 1) % types.length];
    fb.pendingAttack = {
      type,
      timer: 850,
      x: player.x + player.w / 2,
      y: player.y + player.h / 2,
      targets: [player.x - 110, player.x + 20, player.x + 150].map((x) =>
        Math.max(
          level.bossArena.start + 20,
          Math.min(level.bossArena.end - 20, x),
        ),
      ),
    };
  }
}

function drawEndgameBossWarning() {
  if (!level.bossArena || !finalBoss.pendingAttack) return;
  const fb = finalBoss,
    a = fb.pendingAttack;
  ctx.save();
  ctx.strokeStyle = "#e9c18c";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 8]);
  if (a.type === "volley") {
    ctx.beginPath();
    ctx.moveTo(fb.x + fb.w / 2 - camX, fb.y + fb.h * 0.4);
    ctx.lineTo(a.x - camX, a.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(a.x - camX, a.y, 21, 0, Math.PI * 2);
    ctx.stroke();
  } else if (a.type === "meteor") {
    for (const x of a.targets) {
      ctx.beginPath();
      ctx.ellipse(x - camX, GROUND_Y - 5, 27, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(233,193,140,.1)";
      ctx.fillRect(x - camX - 15, GROUND_Y - 300, 30, 295);
    }
  } else {
    ctx.beginPath();
    ctx.ellipse(
      fb.x + fb.w / 2 - camX,
      GROUND_Y - 6,
      80,
      12,
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#e9c18c";
    ctx.fillText("JUMP", fb.x + fb.w / 2 - camX, GROUND_Y - 35);
  }
  ctx.restore();
}

function drawEndgameBoss() {
  const fb = finalBoss;
  if (!fb.active && !(fb.dead && fb.deathAnimTimer > 0)) return;
  const x = fb.x - camX;
  if (x + fb.w < -100 || x > W + 100) return;
  const ratio = fb.hp / fb.maxHp,
    phase = ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
  const light = phase === 1 ? "#abcfd2" : phase === 2 ? "#e1c097" : "#dd936f";
  ctx.save();
  if (fb.dead) {
    fb.deathAnimTimer--;
    ctx.globalAlpha = Math.max(0, fb.deathAnimTimer / 120);
  }
  ctx.translate(x + fb.w / 2, fb.y + fb.h);
  const w = fb.w,
    h = fb.h,
    t = fb.animT || 0,
    step = fb.awakened ? Math.sin(t * 0.009) * 6 : 0;
  ctx.fillStyle = "rgba(9,18,25,.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.53, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // A weathered plated guardian, with a broken mantle and a visible core.
  ctx.fillStyle = "#172a34";
  ctx.beginPath();
  ctx.moveTo(-w * 0.4, -h * 0.76);
  ctx.lineTo(-w * 0.58, -h * 0.46);
  ctx.lineTo(-w * 0.48, -h * 0.11);
  ctx.lineTo(-w * 0.2, -h * 0.25);
  ctx.lineTo(w * 0.18, -h * 0.19);
  ctx.lineTo(w * 0.49, -h * 0.09);
  ctx.lineTo(w * 0.6, -h * 0.47);
  ctx.lineTo(w * 0.41, -h * 0.76);
  ctx.closePath();
  ctx.fill();
  for (const dir of [-1, 1]) {
    ctx.fillStyle = "#3f535d";
    ctx.beginPath();
    ctx.moveTo(dir * w * 0.12, -h * 0.29);
    ctx.lineTo(dir * w * 0.3, -h * 0.24);
    ctx.lineTo(dir * w * 0.32, -18 + dir * step);
    ctx.lineTo(dir * w * 0.16, -10 + dir * step);
    ctx.lineTo(dir * w * 0.08, -h * 0.19);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#6e8385";
    ctx.fillRect(
      dir < 0 ? -w * 0.34 : w * 0.11,
      -13 + dir * step,
      w * 0.25,
      12,
    );
    ctx.fillStyle = "#253d47";
    ctx.fillRect(dir < 0 ? -w * 0.29 : w * 0.14, -h * 0.15, w * 0.17, 9);
  }
  ctx.fillStyle = "#435d65";
  ctx.beginPath();
  ctx.moveTo(-w * 0.32, -h * 0.8);
  ctx.lineTo(w * 0.32, -h * 0.8);
  ctx.lineTo(w * 0.4, -h * 0.52);
  ctx.lineTo(w * 0.22, -h * 0.3);
  ctx.lineTo(-w * 0.23, -h * 0.3);
  ctx.lineTo(-w * 0.4, -h * 0.53);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#718486";
  ctx.beginPath();
  ctx.moveTo(-w * 0.32, -h * 0.8);
  ctx.lineTo(-w * 0.03, -h * 0.69);
  ctx.lineTo(-w * 0.11, -h * 0.48);
  ctx.lineTo(-w * 0.34, -h * 0.53);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w * 0.32, -h * 0.8);
  ctx.lineTo(w * 0.03, -h * 0.69);
  ctx.lineTo(w * 0.11, -h * 0.48);
  ctx.lineTo(w * 0.34, -h * 0.53);
  ctx.closePath();
  ctx.fill();
  for (const dir of [-1, 1]) {
    const lift = fb.pendingAttack ? 12 : 0;
    ctx.fillStyle = "#596f74";
    ctx.beginPath();
    ctx.moveTo(dir * w * 0.33, -h * 0.75);
    ctx.lineTo(dir * w * 0.55, -h * 0.8);
    ctx.lineTo(dir * w * 0.63, -h * 0.65);
    ctx.lineTo(dir * w * 0.42, -h * 0.58);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#344c57";
    ctx.lineWidth = w * 0.14;
    ctx.beginPath();
    ctx.moveTo(dir * w * 0.46, -h * 0.63);
    ctx.lineTo(dir * w * 0.53, -h * 0.45 - lift);
    ctx.lineTo(dir * w * 0.46, -h * 0.32 - lift);
    ctx.stroke();
    ctx.fillStyle = "#7b8f8e";
    ctx.fillRect(
      dir < 0 ? -w * 0.57 : w * 0.37,
      -h * 0.37 - lift,
      w * 0.19,
      30,
    );
  }
  ctx.fillStyle = "#213943";
  ctx.beginPath();
  ctx.moveTo(-w * 0.2, -h * 0.94);
  ctx.lineTo(-w * 0.24, -h * 0.8);
  ctx.lineTo(0, -h * 0.71);
  ctx.lineTo(w * 0.24, -h * 0.8);
  ctx.lineTo(w * 0.2, -h * 0.94);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#7f9290";
  ctx.beginPath();
  ctx.moveTo(-w * 0.21, -h * 0.96);
  ctx.lineTo(-w * 0.24, -h * 0.8);
  ctx.lineTo(-w * 0.11, -h * 0.74);
  ctx.lineTo(-w * 0.06, -h * 0.92);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w * 0.21, -h * 0.96);
  ctx.lineTo(w * 0.24, -h * 0.8);
  ctx.lineTo(w * 0.11, -h * 0.74);
  ctx.lineTo(w * 0.06, -h * 0.92);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#647f83";
  ctx.lineWidth = 6;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(dir * w * 0.17, -h * 0.9);
    ctx.lineTo(dir * w * 0.28, -h * 1.04);
    ctx.lineTo(dir * w * 0.41, -h * 1.09);
    ctx.stroke();
  }
  ctx.fillStyle = fb.awakened ? light : "#637d7e";
  ctx.fillRect(-w * 0.14, -h * 0.86, w * 0.12, 4);
  ctx.fillRect(w * 0.02, -h * 0.86, w * 0.12, 4);
  ctx.fillStyle = "#142d37";
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.66);
  ctx.lineTo(w * 0.1, -h * 0.56);
  ctx.lineTo(0, -h * 0.45);
  ctx.lineTo(-w * 0.1, -h * 0.56);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = light;
  ctx.globalAlpha *= fb.awakened ? 0.7 + Math.sin(t * 0.008) * 0.2 : 0.2;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.62);
  ctx.lineTo(w * 0.056, -h * 0.56);
  ctx.lineTo(0, -h * 0.5);
  ctx.lineTo(-w * 0.056, -h * 0.56);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.save();
  for (const shot of fb.projectiles) {
    const px = shot.x - camX;
    if (px < -30 || px > W + 30) continue;
    ctx.fillStyle = shot.color;
    ctx.beginPath();
    ctx.arc(px, shot.y, shot.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e7e2c5";
    ctx.beginPath();
    ctx.arc(px, shot.y, shot.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function startEndgameAdventure() {
  ac();
  if (actx.state === "suspended") actx.resume();
  state.score = 0;
  const maximum = state.upgrades.maxHp ? 10 : 8;
  state.lives =
    state.settings.difficulty === "hardcore"
      ? Math.floor(maximum * 0.6)
      : maximum;
  state.unlockedLevels = Math.max(state.unlockedLevels || 1, 15);
  saveData();
  loadLevel(14);
  state.mode = "playing";
  state.returnMode = "playing";
}

// =====================================================================
// TITLE SCREEN  --  illustrated, in-world menu (replaces the dashboard)
// Character stands on a cel-shaded platform on the left; a compact,
// nearly-opaque panel on the right carries a clear action hierarchy.
// =====================================================================

const MENU_FONT =
  "'Noto Sans Georgian','BPG Glaho','Sylfaen','DejaVu Sans',system-ui,sans-serif";

function menuHasSave() {
  return (
    (state.unlockedLevels || 1) > 1 ||
    (state.highScore || 0) > 0 ||
    (state.coinsCollected || 0) > 0 ||
    (state.shopCoins || 0) > 0 ||
    (state.levelStars && Object.keys(state.levelStars).length > 0)
  );
}

function continueGame() {
  ac();
  if (actx && actx.state === "suspended") actx.resume();
  const maxIdx = Math.max(
    0,
    (typeof MAX_LEVELS === "number" ? MAX_LEVELS : 20) - 1,
  );
  const idx = Math.max(0, Math.min(maxIdx, (state.unlockedLevels || 1) - 1));
  state.levelIndex = idx;
  state.score = 0;
  const base = state.upgrades.maxHp ? 10 : 8;
  state.lives =
    state.settings && state.settings.difficulty === "hardcore"
      ? Math.floor(base * 0.6)
      : base;
  if (idx >= 14) state.unlockedLevels = Math.max(state.unlockedLevels || 1, 15);
  loadLevel(idx);
  state.mode = "playing";
  state.returnMode = "playing";
}

function drawCoverImage(img, x, y, w, h) {
  const iw = img.naturalWidth,
    ih = img.naturalHeight;
  if (!iw || !ih) return;
  const s = Math.max(w / iw, h / ih);
  const dw = iw * s,
    dh = ih * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function menuOctagon(x, y, w, h, cut) {
  ctx.beginPath();
  ctx.moveTo(x + cut, y);
  ctx.lineTo(x + w - cut, y);
  ctx.lineTo(x + w, y + cut);
  ctx.lineTo(x + w, y + h - cut);
  ctx.lineTo(x + w - cut, y + h);
  ctx.lineTo(x + cut, y + h);
  ctx.lineTo(x, y + h - cut);
  ctx.lineTo(x, y + cut);
  ctx.closePath();
}

function menuMusicButton() {
  return { x: W - 138, y: 18, w: 120, h: 34 };
}

function adventureMenuLayout() {
  const panel = { x: 470, y: 36, w: 690, h: 602 };
  const pad = 34;
  const bx = panel.x + pad;
  const bw = panel.w - pad * 2;
  const buttons = [];
  const hasSave = menuHasSave();
  let y = panel.y + 210;

  if (hasSave) {
    buttons.push({
      id: "continue",
      x: bx,
      y,
      w: bw,
      h: 58,
      kind: "primary",
      title: "გაგრძელება",
      sub: "CONTINUE  ·  მიმდინარე თავი",
    });
    y += 68;
  }
  buttons.push({
    id: "newgame",
    x: bx,
    y,
    w: bw,
    h: 58,
    kind: "primary",
    title: "ახალი თამაში",
    sub: "NEW GAME  ·  თავი 01",
  });
  y += 68;
  buttons.push({
    id: "newworlds",
    x: bx,
    y,
    w: bw,
    h: 50,
    kind: "secondary",
    title: "ახალი სამყაროები",
    sub: "EPISODES 15–20",
  });
  y += 60;

  const gap = 12;
  const hw = (bw - gap) / 2;
  buttons.push({
    id: "levels",
    x: bx,
    y,
    w: hw,
    h: 48,
    kind: "secondary",
    title: "დონეები",
    sub: "LEVELS",
  });
  buttons.push({
    id: "settings",
    x: bx + hw + gap,
    y,
    w: hw,
    h: 48,
    kind: "secondary",
    title: "პარამეტრები",
    sub: "SETTINGS",
  });
  y += 60;

  const chips = [
    ["shop", "მაღაზია", "SHOP"],
    ["quests", "დავალებები", "QUESTS"],
    ["wheel", "ბორბალი", "WHEEL"],
    ["promo", "პრომო", "PROMO"],
  ];
  const cg = 10;
  const cw = (bw - cg * 3) / 4;
  chips.forEach((c, i) => {
    buttons.push({
      id: c[0],
      x: bx + i * (cw + cg),
      y,
      w: cw,
      h: 46,
      kind: "chip",
      title: c[1],
      sub: c[2],
    });
  });

  return { panel, buttons };
}

function drawMenuPlatform(x, y, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(4,9,14,0.32)";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h + 12, w * 0.5, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#33454f";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#22303a";
  ctx.fillRect(x, y + h * 0.46, w, h * 0.54);
  ctx.fillStyle = "#8fd0c0";
  ctx.fillRect(x, y, w, 5);
  ctx.fillStyle = "#55867e";
  ctx.fillRect(x, y + 5, w, 4);
  ctx.fillStyle = "#465a63";
  for (let bx = x + 16; bx < x + w - 10; bx += 48)
    ctx.fillRect(bx, y + h - 9, 7, 4);
  ctx.strokeStyle = "#0b1218";
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function drawMenuCharacter(cx, feetY, targetH) {
  ctx.save();
  ctx.fillStyle = "rgba(4,9,14,0.34)";
  ctx.beginPath();
  ctx.ellipse(cx, feetY + 6, targetH * 0.3, targetH * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const pack = typeof SKIN_FRAMES !== "undefined" ? SKIN_FRAMES.newdino : null;
  const meta = typeof SKIN_META !== "undefined" ? SKIN_META.newdino : null;
  const ready = typeof SKIN_READY !== "undefined" && SKIN_READY.newdino;
  if (!ready || !pack || !pack.idle || !pack.idle.length) return;

  const frames = pack.idle;
  const fps = (meta && meta.fps && meta.fps.idle) || 6;
  const frame = frames[Math.floor(state.time / (1000 / fps)) % frames.length];
  if (!frame || !frame.complete || !frame.naturalWidth) return;

  const refH = (meta && meta.refH) || frame.height;
  const scale = targetH / refH;
  const anchorX = (meta && meta.anchorX) || frame.width / 2;
  const baselineY = (meta && meta.baselineY) || frame.height;
  const bob = Math.sin(state.time * 0.0016) * targetH * 0.012;

  ctx.save();
  ctx.translate(cx, feetY + bob);
  ctx.drawImage(
    frame,
    -anchorX * scale,
    -baselineY * scale,
    frame.width * scale,
    frame.height * scale,
  );
  ctx.restore();
}

function drawMenuPanel(p) {
  ctx.save();
  ctx.fillStyle = "rgba(9,20,27,0.965)";
  menuOctagon(p.x, p.y, p.w, p.h, 22);
  ctx.fill();
  ctx.strokeStyle = "#3d5c64";
  ctx.lineWidth = 3;
  menuOctagon(p.x, p.y, p.w, p.h, 22);
  ctx.stroke();
  ctx.strokeStyle = "rgba(143,208,192,0.42)";
  ctx.lineWidth = 1.5;
  menuOctagon(p.x + 7, p.y + 7, p.w - 14, p.h - 14, 17);
  ctx.stroke();
  ctx.fillStyle = "#8fd0c0";
  const cs = [
    [p.x + 18, p.y + 18],
    [p.x + p.w - 18, p.y + 18],
    [p.x + 18, p.y + p.h - 18],
    [p.x + p.w - 18, p.y + p.h - 18],
  ];
  for (const c of cs) {
    ctx.beginPath();
    ctx.arc(c[0], c[1], 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMenuTitle(p) {
  const tx = p.x + 34;
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#8fd0c0";
  ctx.font = `700 13px ${MENU_FONT}`;
  ctx.fillText("SCI-FI PLATFORMER  ·  20 ეპიზოდი", tx, p.y + 40);

  const by = p.y + 128;
  ctx.font = `900 84px ${MENU_FONT}`;
  ctx.lineJoin = "round";
  ctx.lineWidth = 11;
  ctx.strokeStyle = "#0d161c";
  ctx.strokeText("DINO", tx, by);
  ctx.fillStyle = "#7a2c44";
  ctx.fillText("DINO", tx + 4, by + 4);
  const grd = ctx.createLinearGradient(0, by - 74, 0, by + 8);
  grd.addColorStop(0, "#fdf6e3");
  grd.addColorStop(0.55, "#e9e2c9");
  grd.addColorStop(1, "#c6bfa2");
  ctx.fillStyle = grd;
  ctx.fillText("DINO", tx, by);
  ctx.fillStyle = "#ff3d6e";
  ctx.fillRect(tx + 2, by + 14, 212, 5);

  ctx.fillStyle = "#d3e2d8";
  ctx.font = `600 22px ${MENU_FONT}`;
  ctx.fillText("გეოდინო: ხულიგანური პარკური", tx, by + 52);

  ctx.strokeStyle = "#31505a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tx, by + 74);
  ctx.lineTo(p.x + p.w - 34, by + 74);
  ctx.stroke();
  ctx.restore();
}

function drawMenuButton(b) {
  const hover =
    typeof menuPointer !== "undefined" &&
    menuPointer.active &&
    menuPointer.x >= b.x &&
    menuPointer.x <= b.x + b.w &&
    menuPointer.y >= b.y &&
    menuPointer.y <= b.y + b.h;
  const off = hover ? -2 : 0;
  const cut = b.kind === "chip" ? 8 : 14;
  ctx.save();
  ctx.translate(0, off);
  let fill, border, tcol, scol;
  if (b.kind === "primary") {
    fill = hover ? "#eef7e6" : "#d9e8d0";
    border = "#0d161c";
    tcol = "#12303a";
    scol = "#4d6b60";
  } else if (b.kind === "secondary") {
    fill = hover ? "#244a56" : "#173039";
    border = hover ? "#8fd0c0" : "#3d6b6f";
    tcol = "#e4f0e8";
    scol = "#89a79e";
  } else {
    fill = hover ? "#1d3b46" : "#132832";
    border = hover ? "#7fc0b4" : "#315258";
    tcol = "#cfe0d6";
    scol = "#7c9a92";
  }
  ctx.fillStyle = fill;
  menuOctagon(b.x, b.y, b.w, b.h, cut);
  ctx.fill();
  ctx.lineWidth = b.kind === "primary" ? 3 : 2;
  ctx.strokeStyle = border;
  menuOctagon(b.x, b.y, b.w, b.h, cut);
  ctx.stroke();
  ctx.strokeStyle =
    b.kind === "primary" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1.5;
  const inset = cut + 4;
  ctx.beginPath();
  ctx.moveTo(b.x + inset, b.y + 3);
  ctx.lineTo(b.x + b.w - inset, b.y + 3);
  ctx.stroke();

  ctx.textBaseline = "alphabetic";
  if (b.kind === "chip") {
    ctx.textAlign = "center";
    ctx.fillStyle = tcol;
    ctx.font = `700 15px ${MENU_FONT}`;
    ctx.fillText(b.title, b.x + b.w / 2, b.y + b.h * 0.46);
    ctx.fillStyle = scol;
    ctx.font = `600 9px ${MENU_FONT}`;
    ctx.fillText(b.sub, b.x + b.w / 2, b.y + b.h * 0.8);
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = tcol;
    ctx.font = `700 ${b.kind === "primary" ? 23 : 18}px ${MENU_FONT}`;
    ctx.fillText(b.title, b.x + 22, b.y + b.h * 0.46);
    ctx.fillStyle = scol;
    ctx.font = `600 11px ${MENU_FONT}`;
    ctx.fillText(b.sub, b.x + 22, b.y + b.h * 0.78);
    ctx.textAlign = "right";
    ctx.fillStyle = b.kind === "primary" ? "#12303a" : "#8fd0c0";
    ctx.font = `700 20px ${MENU_FONT}`;
    ctx.fillText("▶", b.x + b.w - 20, b.y + b.h * 0.55);
  }
  ctx.restore();
}

function drawMenuFooter(p) {
  const bx = p.x + 34;
  const bw = p.w - 68;
  const fy = p.y + p.h - 74;
  ctx.save();
  ctx.strokeStyle = "#31505a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx, fy);
  ctx.lineTo(bx + bw, fy);
  ctx.stroke();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#8fb0a6";
  ctx.font = `600 13px ${MENU_FONT}`;
  ctx.fillText(`რეკორდი  ${state.highScore || 0}`, bx, fy + 26);
  ctx.textAlign = "right";
  ctx.fillText(
    `მონეტები  ${(state.coinsCollected || 0) + (state.shopCoins || 0)}`,
    bx + bw,
    fy + 26,
  );
  ctx.textAlign = "left";
  ctx.fillStyle = "#6f8c86";
  ctx.font = `500 12px ${MENU_FONT}`;
  ctx.fillText(
    "მოძრაობა ← →   ნახტომი SPACE   დახრა ↓   ცეცხლი F",
    bx,
    fy + 52,
  );
  ctx.restore();
}

function drawMenuMusicButton() {
  const m = menuMusicButton();
  const hover =
    typeof menuPointer !== "undefined" &&
    menuPointer.active &&
    menuPointer.x >= m.x &&
    menuPointer.x <= m.x + m.w &&
    menuPointer.y >= m.y &&
    menuPointer.y <= m.y + m.h;
  ctx.save();
  ctx.fillStyle = hover ? "#244a56" : "#132832";
  menuOctagon(m.x, m.y, m.w, m.h, 9);
  ctx.fill();
  ctx.strokeStyle = hover ? "#8fd0c0" : "#315258";
  ctx.lineWidth = 2;
  menuOctagon(m.x, m.y, m.w, m.h, 9);
  ctx.stroke();
  ctx.fillStyle = bgmMuted ? "#ff8aa4" : "#cfe0d6";
  ctx.font = `700 13px ${MENU_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    bgmMuted ? "🔇 მუსიკა" : "🎵 მუსიკა",
    m.x + m.w / 2,
    m.y + m.h / 2 + 1,
  );
  ctx.restore();
}

function drawAdventureMenu() {
  ctx.save();
  if (menuBgImage.complete && menuBgImage.naturalWidth) {
    drawCoverImage(menuBgImage, 0, 0, W, H);
  } else {
    ctx.fillStyle = "#101f2b";
    ctx.fillRect(0, 0, W, H);
  }

  // Quieter, lower-contrast field so gameplay art and the menu read clearly.
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "rgba(6,14,20,0.20)");
  g.addColorStop(0.34, "rgba(6,14,20,0.46)");
  g.addColorStop(0.48, "rgba(7,16,22,0.88)");
  g.addColorStop(1, "rgba(7,16,22,0.94)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const vg = ctx.createLinearGradient(0, 0, 0, H);
  vg.addColorStop(0, "rgba(4,9,14,0.55)");
  vg.addColorStop(0.42, "rgba(4,9,14,0)");
  vg.addColorStop(1, "rgba(4,9,14,0.6)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  const layout = adventureMenuLayout();
  drawMenuPlatform(72, 566, 330, 26);
  drawMenuCharacter(230, 566, 300);
  drawMenuPanel(layout.panel);
  drawMenuTitle(layout.panel);
  for (const b of layout.buttons) drawMenuButton(b);
  drawMenuFooter(layout.panel);
  drawMenuMusicButton();
  ctx.restore();
}

function handleAdventureMenuClick(mx, my) {
  const layout = adventureMenuLayout();
  for (const b of layout.buttons) {
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y - 3 && my <= b.y + b.h + 3) {
      sfxBell();
      if (b.id === "continue") continueGame();
      else if (b.id === "newgame") startGame();
      else if (b.id === "newworlds") startEndgameAdventure();
      else if (b.id === "levels") openLevelSelect();
      else if (b.id === "settings") openSettings();
      else if (b.id === "shop") openShop();
      else if (b.id === "quests") openDailyQuests();
      else if (b.id === "wheel") openLuckyWheel();
      else if (b.id === "promo") openPromoCodePrompt();
      return;
    }
  }
  const m = menuMusicButton();
  if (mx >= m.x && mx <= m.x + m.w && my >= m.y && my <= m.y + m.h)
    toggleBgmMute();
}

function updateAdventureBarrels(dt) {
  const step = dt / 16.67;
  for (const lane of level.barrelLanes || []) {
    const nearby = player.x > lane.minX - 620 && player.x < lane.x + 220;
    if (!nearby) {
      lane.phase = "idle";
      lane.timer = 0;
      continue;
    }
    const occupied = level.boulders.some((b) => b.lane === lane && !b.dead);
    if (lane.phase === "idle" && !occupied) {
      lane.phase = "warning";
      lane.timer = 0;
    }
    lane.timer += dt;
    if (lane.phase === "warning" && lane.timer >= lane.warningMs) {
      const r = 22;
      level.boulders.push({
        adventureBarrel: true,
        lane,
        x: lane.x,
        y: lane.y - r,
        r,
        vx: -lane.speed,
        angle: 0,
        hp: 2,
        dead: false,
        material: lane.material,
      });
      lane.serial++;
      lane.phase = "cooldown";
      lane.timer = 0;
    } else if (
      lane.phase === "cooldown" &&
      lane.timer > lane.cooldown &&
      !occupied
    ) {
      lane.phase = "idle";
      lane.timer = 0;
    }
  }
  for (let i = level.boulders.length - 1; i >= 0; i--) {
    const b = level.boulders[i];
    if (!b.adventureBarrel) continue;
    const previous = b.x;
    b.x += b.vx * step;
    b.angle += (b.x - previous) / b.r;
    // Circle against the player's inset rectangle: corners are forgiving.
    const closestX = Math.max(
      player.x + 4,
      Math.min(player.x + player.w - 4, b.x),
    );
    const closestY = Math.max(
      player.y + 3,
      Math.min(player.y + player.h - 3, b.y),
    );
    if (Math.hypot(b.x - closestX, b.y - closestY) < b.r - 3)
      hurtPlayer("მოგორავე კასრი!", "trap");
    if (b.dead || b.x < b.lane.minX || Math.abs(b.x - player.x) > 1500)
      level.boulders.splice(i, 1);
  }
}

function drawAdventureBarrel(b, local = false) {
  const x = local ? b.x : b.x - camX;
  if (!local && (x + b.r < 0 || x - b.r > W)) return;
  ctx.save();
  ctx.translate(x, b.y);
  ctx.rotate(b.angle);
  const metal = b.material === "steel",
    stone = b.material === "stone";
  ctx.fillStyle = metal ? "#637b7b" : stone ? "#7b8277" : "#92683f";
  ctx.beginPath();
  ctx.arc(0, 0, b.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = metal ? "#b3c7c3" : stone ? "#bbc0a4" : "#d0b48b";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, b.r - 3, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = metal ? "#334a50" : stone ? "#545e54" : "#59442d";
  ctx.lineWidth = 2;
  for (let k = -15; k <= 15; k += 10) {
    ctx.beginPath();
    ctx.moveTo(k, -22);
    ctx.lineTo(k + (stone ? 8 : 0), 22);
    ctx.stroke();
  }
  ctx.fillStyle = metal ? "#a8bbb8" : "#454c48";
  ctx.fillRect(-22, -13, 44, 4);
  ctx.fillRect(-22, 9, 44, 4);
  ctx.restore();
  ctx.fillStyle = "#334143";
  ctx.fillRect(-3, -3, 6, 6);
  ctx.restore();
}

function drawAdventureBarrelLanes() {
  for (const lane of level.barrelLanes || []) {
    const x = lane.x - camX;
    if (x < -100 || x > W + 150) continue;
    ctx.save();
    ctx.translate(x, lane.y);
    // A loading rack and a short chute explain where the barrel comes from.
    ctx.fillStyle = level.scene.stone;
    ctx.fillRect(16, -110, 14, 110);
    ctx.fillRect(-30, -92, 64, 12);
    ctx.strokeStyle = level.scene.surface;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(26, -73);
    ctx.lineTo(-39, -7);
    ctx.stroke();
    for (let i = 0; i < 2; i++)
      drawAdventureBarrel(
        {
          x: 3 + i * 10,
          y: -63 - i * 37,
          r: 17,
          angle: 0.3,
          material: lane.material,
        },
        true,
      );
    ctx.fillStyle = lane.phase === "warning" ? "#e8bb76" : "#9cae96";
    ctx.fillRect(19, -108, 8, 8);
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    if (lane.phase === "warning") ctx.fillText("BARREL ↓", -5, -130);
    ctx.restore();
  }
}

function updateAdventureRoutes(dt) {
  for (const route of level.clockRoutes || []) {
    route.remaining = Math.max(0, route.remaining - dt);
    const inside = overlap(player, {
      x: route.x - 6,
      y: route.y - 54,
      w: route.w + 12,
      h: 72,
    });
    if (inside && !route.inside) {
      route.remaining = route.duration;
      sfxBell();
      addFloatingText(
        route.x,
        route.y - 75,
        "BONUS BRIDGE · 10 SECONDS",
        "#d6c49a",
      );
    }
    route.inside = inside;
    for (const p of level.plats)
      if (p.adventureBridge === route.id) p.enabled = route.remaining > 0;
  }
  for (const chest of level.treasures || []) {
    if (chest.taken || !overlap(player, chest)) continue;
    chest.taken = true;
    level.treasureCount++;
    addScore(500);
    state.coinsCollected = (state.coinsCollected || 0) + 15;
    const max = state.upgrades.maxHp ? 10 : 8;
    if (state.lives < max) state.lives++;
    else player.hasShield = true;
    sfxBell();
    spawnParticles(chest.x + 19, chest.y + 12, "#dac18b", 12, 1);
    addFloatingText(
      chest.x,
      chest.y - 22,
      "SECRET CACHE · +500 / +15 COINS",
      "#e5c891",
    );
  }
}

function drawAdventureBridge(p) {
  const x = p.x - camX;
  if (x + p.w < 0 || x > W) return;
  const route = level.clockRoutes.find((r) => r.id === p.adventureBridge);
  ctx.save();
  ctx.strokeStyle = p.enabled ? "#acb9a8" : "rgba(172,185,168,.32)";
  ctx.lineWidth = 2;
  if (!p.enabled) {
    ctx.setLineDash([6, 7]);
    ctx.strokeRect(x, p.y, p.w, p.h);
    ctx.restore();
    return;
  }
  if (route.remaining < 2000)
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(level.adventureTime * 0.014) ** 2;
  ctx.fillStyle = level.scene.stone;
  ctx.fillRect(x, p.y, p.w, p.h);
  ctx.fillStyle = level.scene.surface;
  for (let k = 0; k < p.w; k += 20) {
    ctx.fillRect(x + k, p.y, 17, 5);
    ctx.fillRect(x + k + 7, p.y + 8, 3, 9);
  }
  ctx.strokeRect(x, p.y, p.w, p.h);
  ctx.restore();
}

function drawAdventureRoutes() {
  for (const route of level.clockRoutes || []) {
    const x = route.x - camX;
    if (x < -90 || x > W + 90) continue;
    ctx.fillStyle = "#354b4a";
    ctx.fillRect(x, route.y, route.w, route.h);
    ctx.fillStyle = route.remaining > 0 ? "#a5c3a2" : "#d4ba87";
    ctx.fillRect(x + 5, route.y + 4, route.w - 10, 5);
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      route.remaining > 0
        ? `BRIDGE ${Math.ceil(route.remaining / 1000)}s`
        : "STEP · BONUS BRIDGE",
      x + 22,
      route.y - 20,
    );
  }
  for (const chest of level.treasures || []) {
    const x = chest.x - camX;
    if (x < -70 || x > W + 70) continue;
    ctx.fillStyle = chest.taken ? "#514b3a" : "#8d7148";
    ctx.fillRect(x, chest.y + 12, chest.w, 24);
    ctx.strokeStyle = "#d0b485";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, chest.y + 13, chest.w - 2, 21);
    ctx.fillStyle = "#b79a68";
    ctx.fillRect(x - 1, chest.y + (chest.taken ? -5 : 0), chest.w + 2, 12);
    if (!chest.taken) {
      ctx.fillStyle = "#e4d5a8";
      ctx.fillRect(x + 16, chest.y + 17, 6, 9);
    }
    ctx.fillStyle = "#cfbd94";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(chest.taken ? "FOUND" : "SECRET CACHE", x + 19, chest.y - 12);
  }
}
