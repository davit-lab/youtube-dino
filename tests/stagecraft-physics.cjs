const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {}),
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => (window.requestAnimationFrame = () => 1));
  await page.goto(process.env.GAME_URL || "http://localhost:3000");
  await page.waitForTimeout(700);
  const result = await page.evaluate(() => {
    state.settings.sfxVolume = 0;
    state.settings.highJumpAssist = false;
    state.upgrades.doubleJump = false;
    state.equippedWeapon = "pistol";
    const carry = [],
      routes = [];
    for (const [n, type] of [
      [14, "tilt"],
      [15, "ring"],
      [15, "counterweight"],
      [16, "crane"],
      [17, "bucket"],
    ]) {
      loadLevel(n);
      state.mode = "playing";
      zombies = [];
      const h = level.stagecraft.hazards.find((h) => h.type === type);
      player.x = h.x;
      prepareStagecraft(0);
      const p = h.pads[0];
      resetPlayer({
        x: p.x + p.w / 2 - 16,
        y: stageSurface(p, p.x + p.w / 2) - 54,
      });
      player.invuln = 99999;
      let frames = 0;
      for (let i = 0; i < 120; i++) {
        state.time += 16.67;
        updatePlayer(16.67);
        if (
          Math.abs(player.y + player.h - stageSurface(p, player.x + 16)) < 10 &&
          player.x + 32 > p.x &&
          player.x < p.x + p.w
        )
          frames++;
      }
      carry.push({ type, frames });
    }
    const recoveries = [];
    for (const difficulty of ["easy", "normal", "hardcore"]) {
      for (let n = 14; n < 20; n++) {
        loadLevel(n);
        state.mode = "playing";
        state.settings.difficulty = difficulty;
        state.lives = 8;
        zombies = [];
        const h = level.stagecraft.hazards.find((h) => h.crossing);
        const entry = h.crossing.entry;
        resetPlayer({ x: h.x - 32, y: h.crossing.catchY - 54 });
        player.onGround = true;
        player.invuln = 0;
        keys.Space = true;
        let boarded = false;
        for (let f = 0; f < 65; f++) {
          state.time += 16.67;
          updatePlayer(16.67);
          updateEndgame(16.67);
          keys.Space = false;
          if (f > 5 && player.onGround && player.y + player.h <= entry.y + 2) {
            boarded = true;
            break;
          }
        }
        recoveries.push({
          level: n + 1,
          difficulty,
          boarded,
          noDamage: state.lives === 8,
        });
      }
    }
    state.settings.difficulty = "normal";
    // Collision/physics reachability only: hazards and combat are tested separately.
    // Each graph edge executes the actual updatePlayer function, without upgrades.
    for (let n = 14; n < 20; n++) {
      loadLevel(n);
      const original = level;
      const pads = original.plats
        .filter(
          (p) => p.enabled !== false && !p.adventureBridge && !p.stagePier,
        )
        .flatMap((p) =>
          p.vx && p.maxX !== undefined
            ? [
                { ...p, x: p.minX, vx: 0, vy: 0, angle: 0 },
                { ...p, x: p.maxX, vx: 0, vy: 0, angle: 0 },
              ]
            : [{ ...p, vx: 0, vy: 0, angle: 0 }],
        );
      const mini = {
        ...original,
        stagecraft: null,
        journey: null,
        plats: [],
        flag: null,
        obstacles: [],
        checkpoints: [],
        coins: [],
        coinBags: [],
        supplyCaches: [],
        relics: [],
        zombies: [],
      };
      for (const k of [
        "winds",
        "jumpboxes",
        "trampolines",
        "clouds",
        "crumblingPlats",
        "swingPoints",
        "swingingAxes",
        "lavas",
        "spikes",
        "firejets",
        "conveyors",
        "steamVents",
        "crushers",
        "birds",
      ])
        mini[k] = [];
      const seen = new Set([0]),
        queue = [0];
      let attempts = 0,
        reached = false;
      while (queue.length) {
        const ai = queue.shift(),
          a = pads[ai];
        if (
          a.x <= original.flag.x &&
          a.x + a.w >= original.flag.x + original.flag.w
        ) {
          reached = true;
        }
        for (let bi = 0; bi < pads.length; bi++) {
          if (seen.has(bi)) continue;
          const b = pads[bi];
          if (
            b.x > a.x + a.w + 190 ||
            b.x + b.w < a.x - 190 ||
            b.y < a.y - 146 ||
            b.y > a.y + 230
          )
            continue;
          const goingLeft = b.x < a.x;
          const starts = goingLeft ? [a.x + 2,
            Math.max(a.x + 2, Math.min(a.x + a.w - 36, b.x + b.w + 30)),
            Math.max(a.x + 2, Math.min(a.x + a.w - 36, b.x + b.w + 70))
          ] : [
            a.x + a.w - 36,
            Math.max(a.x + 2, Math.min(a.x + a.w - 36, b.x - 65)),
            Math.max(a.x + 2, Math.min(a.x + a.w - 36, b.x - 105)),
          ];
          let landed = false;
          for (const sx of starts) {
            attempts++;
            level = mini;
            mini.plats = [a, b];
            zombies = [];
            bullets = [];
            state.mode = "playing";
            resetPlayer({ x: sx, y: a.y - 54 });
            player.invuln = 99999;
            keys.Space = true;
            for (let f = 0; f < 82; f++) {
              keys.ArrowRight = !goingLeft && player.x < b.x + b.w - 55;
              keys.ArrowLeft = goingLeft && player.x > b.x + 20;
              state.time += 16.67;
              updatePlayer(16.67);
              keys.Space = false;
              particles.length = 0;
              if (
                f > 5 &&
                player.onGround &&
                Math.abs(player.y + 54 - b.y) < 5 &&
                player.x + 32 > b.x + 2 &&
                player.x < b.x + b.w - 2
              ) {
                landed = true;
                break;
              }
              if (player.isFalling || player.dead) break;
            }
            keys.Space = keys.ArrowRight = keys.ArrowLeft = false;
            if (landed) break;
          }
          if (landed) {
            seen.add(bi);
            queue.push(bi);
          }
        }
      }
      const rewards = [
        ...original.relics,
        ...original.treasures,
        ...(original.coinBags || []),
      ];
      const rewardsReachable = rewards.every((r) =>
        [...seen].some((i) => {
          const p = pads[i];
          return (
            r.x + r.w > p.x - 70 &&
            r.x < p.x + p.w + 70 &&
            r.y + r.h >= p.y - 180 &&
            r.y <= p.y + 5
          );
        }),
      );
      level = original;
      routes.push({
        level: n + 1,
        reached,
        rewardsReachable,
        reachablePlatforms: seen.size,
        attempts,
        farthest: Math.max(...[...seen].map((i) => pads[i].x + pads[i].w)),
      });
    }
    loadLevel(14);
    state.mode = "playing";
    zombies = [];
    for (const [x, type] of [
      [420, "rootbound"],
      [490, "worker"],
    ]) {
      const z = makeStageZombie({ x, floor: GROUND_Y, lo: 350, hi: 650, type });
      z.phase = "attack";
      z.startX = z.targetX = x;
      z.duration = z.timer = 440;
    }
    resetPlayer({ x: 490, y: GROUND_Y - 54 });
    state.lives = 8;
    player.invuln = 0;
    updateZombies(16.67);
    const damageRespawn = state.lives === 7 && zombies.length === 0;
    return { carry, routes, recoveries, damageRespawn };
  });
  console.log(JSON.stringify({ ...result, errors }, null, 2));
  await browser.close();
  assert.equal(errors.length, 0);
  assert.ok(result.damageRespawn);
  assert.ok(result.carry.every((r) => r.frames === 120));
  assert.ok(result.routes.every((r) => r.reached && r.rewardsReachable));
  assert.ok(result.recoveries.every((r) => r.boarded && r.noDamage));
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
