/* Run with PLAYWRIGHT_MODULE=/path/to/playwright node tests/stagecraft-browser.cjs. */
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
  const page = await browser.newPage({
      viewport: { width: 1400, height: 900 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => (window.requestAnimationFrame = () => 1));
  await page.goto(process.env.GAME_URL || "http://localhost:3000");
  await page.waitForTimeout(800);
  const report = await page.evaluate(() => {
    const checks = {},
      info = {};
    state.settings.sfxVolume = 0;
    const load = (n) => {
      loadLevel(n);
      state.mode = "playing";
      state.settings.difficulty = "normal";
      player.invuln = 99999;
      zombies = [];
    };
    const place = (x, y = GROUND_Y, h = 54) => {
      resetPlayer({ x, y: y - h });
      player.h = h;
      player.y = y - h;
      player.onGround = true;
      player.invuln = 99999;
      player.vx = player.vy = 0;
    };
    const step = (
      n,
      fn = () => {
        prepareStagecraft(16.67);
        updateStagecraft(16.67);
      },
    ) => {
      for (let i = 0; i < n; i++) fn();
    };
    checks.allMechanics =
      new Set(
        LEVELS.slice(14, 20).flatMap((l) =>
          l.stagecraft.hazards.map((h) => h.type),
        ),
      ).size === 18;
    checks.rewardsPreserved = LEVELS.slice(14, 20).every(
      (l, i) =>
        l.relics.length === 3 &&
        l.journey.originalCheckpoints === (i === 2 ? 5 : 4) &&
        l.checkpoints.length > l.journey.originalCheckpoints &&
        l.treasures.length === 1,
    );
    checks.sixVariants = STAGE_ZOMBIE_TYPES.every((type) =>
      LEVELS.slice(14, 20).some((l) =>
        l.stagecraft.spawns.some((s) => s.type === type),
      ),
    );
    checks.sixAuthoredCrossings = LEVELS.slice(14, 20).every((l) =>
      l.stagecraft.hazards.some((h) => h.crossing),
    );
    checks.recoveryGapsStayOpen = LEVELS.slice(14, 20).every((l) => {
      const h = l.stagecraft.hazards.find((h) => h.crossing);
      const center = h.x + h.w / 2;
      return !l.plats.some(
        (p) =>
          p.recovery &&
          p.y === h.crossing.catchY &&
          p.x < center &&
          p.x + p.w > center,
      );
    });
    checks.checkpointsStillSupported = LEVELS.slice(14, 20).every((l) =>
      l.checkpoints.every((c) =>
        l.plats.some(
          (p) =>
            p.enabled !== false &&
            !p.vx &&
            !p.vy &&
            Math.abs(p.y - c.y) < 1 &&
            p.x <= c.x &&
            p.x + p.w >= c.x + 32,
        ),
      ),
    );
    load(15);
    const rings = level.stagecraft.hazards.filter((h) => h.type === "ring");
    for (const ring of rings.slice(0, 2)) {
      place(ring.x);
      step(10, () => prepareStagecraft(16.67));
    }
    checks.laterRingReverses = rings[0].angle > 0 && rings[1].angle < 0;
    const flying = makeStageZombie({
      x: 400,
      floor: GROUND_Y,
      lo: 300,
      hi: 600,
      type: "windborne",
    });
    flying.phase = "attack";
    flying.y = GROUND_Y - flying.h - 110;
    camX = 0;
    ctx.clearRect(0, 0, W, H);
    drawStageZombie(flying);
    const pixels = ctx.getImageData(380, flying.y, 90, 45).data;
    checks.airborneZombieVisible = pixels.some((v, i) => i % 4 === 3 && v > 0);
    load(14);
    let h = level.stagecraft.hazards.find((h) => h.type === "tilt"),
      p = h.pads[0];
    place(p.x + p.w - 60, p.y);
    step(50, () => prepareStagecraft(16.67));
    checks.tiltWeighted =
      p.angle > 0 &&
      Math.abs(player.y + player.h - stageSurface(p, player.x + 16)) < 8;
    place(0);
    step(120, () => prepareStagecraft(16.67));
    checks.tiltReturns = Math.abs(p.angle) < 0.02;
    h = level.stagecraft.hazards.find((h) => h.type === "waterfall");
    place(h.x, h.y);
    h.active = true;
    const wx = player.x;
    updateStagecraft(16.67);
    checks.waterPush = player.x > wx;
    h = level.stagecraft.hazards.find((h) => h.type === "vine");
    checks.vineAnchor =
      hitStageTarget({ x: h.anchor.x + 16, y: h.anchor.y + 16, size: 4 }) &&
      h.disabled > 0;
    load(15);
    for (const type of ["ring", "counterweight"]) {
      h = level.stagecraft.hazards.find((h) => h.type === type);
      place(h.x);
      prepareStagecraft(0);
      p = h.pads[0];
      place(p.x + 20, p.y);
      const initial = { x: player.x, y: player.y };
      step(30, () => prepareStagecraft(16.67));
      checks[type + "Carries"] =
        Math.abs(player.y + player.h - stageSurface(p, player.x + 16)) < 8 &&
        (player.y !== initial.y || player.x !== initial.x);
    }
    h = level.stagecraft.hazards.find((h) => h.type === "bell");
    place(h.x + 20);
    h.active = true;
    updateStagecraft(16);
    checks.bellWave = h.shots.length === 2;
    load(16);
    h = level.stagecraft.hazards.find((h) => h.type === "junction");
    const old = h.selected;
    activateStageSwitch(h);
    checks.powerSwitch = h.selected !== old;
    h = level.stagecraft.hazards.find((h) => h.type === "crane");
    p = h.pads[0];
    place(p.x + 20, p.y);
    step(25, () => prepareStagecraft(16.67));
    checks.craneCarries = Math.abs(player.y + player.h - p.y) < 8;
    h = level.stagecraft.hazards.find((h) => h.type === "train");
    place(h.x);
    h.clock = h.period * stageTuning().warning * 0.5;
    prepareStagecraft(0);
    checks.trainWarns = h.warning && !h.active;
    h.clock = h.period * stageTuning().warning * 0.72;
    prepareStagecraft(0);
    checks.trainMoves = h.active && h.trainX > h.x - 420;
    load(17);
    h = level.stagecraft.hazards.find((h) => h.type === "bucket");
    place(h.x);
    prepareStagecraft(0);
    p = h.pads[0];
    place(p.x + 20, p.y);
    step(30, () => prepareStagecraft(16.67));
    checks.bucketCarries = Math.abs(player.y + player.h - p.y) < 8;
    h = level.stagecraft.hazards.find((h) => h.type === "crystal");
    p = h.pads[0];
    place(p.x + 30, p.y);
    step(110, () => prepareStagecraft(16.67));
    checks.crystalBreaks = !p.enabled;
    step(180, () => prepareStagecraft(16.67));
    checks.crystalRecovers = p.enabled;
    load(18);
    h = level.stagecraft.hazards.find((h) => h.type === "tide");
    place(h.x);
    h.clock = 0;
    updateStagecraft(0);
    const low = h.lavaY;
    h.clock = Math.PI / 0.0013;
    updateStagecraft(0);
    checks.tideRises = h.lavaY < low - 60 && h.pads.every((p) => p.y < h.lavaY);
    h = level.stagecraft.hazards.find((h) => h.type === "steam");
    activateStageSwitch(h);
    place(h.x);
    prepareStagecraft(0);
    checks.steamOpens = h.pads.every((p) => p.enabled);
    step(600, () => prepareStagecraft(16.67));
    checks.steamExpires = h.pads.every((p) => !p.enabled);
    h.debounce = 0;
    activateStageSwitch(h);
    prepareStagecraft(0);
    checks.steamReusable = h.pads.every((p) => p.enabled);
    load(19);
    h = level.stagecraft.hazards.find((h) => h.type === "beam");
    place(h.x);
    let lit = false;
    step(160, () => {
      prepareStagecraft(16.67);
      updateStagecraft(16.67);
      lit ||= h.active;
    });
    checks.receiverActivates = lit;
    h = level.stagecraft.hazards.find((h) => h.type === "resonance");
    place(h.x);
    h.clock = 4400;
    prepareStagecraft(0);
    checks.resonanceOff = h.pads.some((p) => !p.enabled);
    h.clock = 0;
    prepareStagecraft(0);
    checks.resonanceReturns = h.pads.every((p) => p.enabled);
    for (const mode of ["easy", "normal", "hardcore"]) {
      load(19);
      state.settings.difficulty = mode;
      h = level.stagecraft.hazards.find((h) => h.type === "seal");
      place(h.x - 80);
      level.switches.find((b) => b.id === h.doorId).pressed = true;
      for (let i = 0; i < 1200 && !h.done; i++) {
        updateSealEncounter(h, 16.67);
        for (let j = zombies.length - 1; j >= 0; j--) {
          zombies[j].health = 0;
          updateStageZombie(zombies[j], 40, j);
        }
      }
      checks["sealCompletes" + mode] =
        h.done && level.doors.find((d) => d.id === h.doorId).open;
      resetStagecraft(level, true);
      checks["sealPersists" + mode] = h.done;
    }
    load(17);
    h = level.stagecraft.hazards.find((h) => h.type === "drill");
    place(h.x + 8, h.y);
    player.invuln = 0;
    state.lives = 8;
    h.clock = h.period * stageTuning().warning * 0.55;
    prepareStagecraft(0);
    updateStagecraft(0);
    checks.drillWarningSafe = state.lives === 8;
    h.clock = h.period * stageTuning().warning * 0.75;
    updateStagecraft(0);
    checks.drillContact = state.lives === 7;
    load(17);
    h = level.stagecraft.hazards.find((h) => h.type === "drill");
    place(h.x + 85, h.y);
    player.invuln = 0;
    state.lives = 8;
    h.clock = h.period * stageTuning().warning * 0.75;
    updateStagecraft(0);
    checks.drillPocketSafe = state.lives === 8;
    load(18);
    h = level.stagecraft.hazards.find((h) => h.type === "slag");
    p = h.pads[0];
    place(p.x + 30, p.y);
    step(170, () => prepareStagecraft(16.67));
    checks.slagSinks = !p.enabled;
    step(180, () => prepareStagecraft(16.67));
    checks.slagCools = p.enabled;
    load(16);
    h = level.stagecraft.hazards.find((h) => h.type === "train");
    place(h.x + 30, h.y - 105);
    player.invuln = 0;
    state.lives = 8;
    h.clock = h.period * stageTuning().warning * 0.75;
    prepareStagecraft(0);
    updateStagecraft(0);
    checks.trainHighRouteSafe = state.lives === 8;
    info.variants = [];
    for (const type of STAGE_ZOMBIE_TYPES) {
      load(14);
      place(0);
      const z = makeStageZombie({
        x: 400,
        floor: GROUND_Y,
        lo: 350,
        hi: 700,
        type,
      });
      place(240);
      z.timer = 0;
      updateStageZombie(z, 16, 0);
      checks[type + "Emerges"] = z.phase === "idle";
      z.timer = 0;
      updateStageZombie(z, 16, 0);
      const action = z.phase;
      checks[type + "Windup"] = ["windup", "channel"].includes(action);
      z.timer = 0;
      updateStageZombie(z, 16, 0);
      if (type !== "guardian") {
        checks[type + "Attacks"] = z.phase === "attack";
        z.timer = 0;
        updateStageZombie(z, 16, 0);
        checks[type + "Recovers"] = z.phase === "recover";
      }
      z.health -= damageStageZombie(z, { damage: z.maxHealth, vx: 1, y: z.y });
      updateStageZombie(z, 16, 0);
      checks[type + "Dies"] = z.phase === "dead";
      updateStageZombie(z, 400, 0);
      info.variants.push({ type, action });
    }
    load(16);
    let z = makeStageZombie({
      x: 400,
      floor: GROUND_Y,
      lo: 350,
      hi: 700,
      type: "worker",
    });
    z.facing = -1;
    z.phase = "idle";
    checks.workerArmor =
      damageStageZombie(z, { damage: 2, vx: 1, y: z.y + 30 }) <
      damageStageZombie(z, { damage: 2, vx: -1, y: z.y + 30 });
    load(19);
    z = makeStageZombie({
      x: 400,
      floor: GROUND_Y,
      lo: 350,
      hi: 700,
      type: "guardian",
    });
    z.phase = "channel";
    damageStageZombie(z, { damage: 1, vx: 1, y: z.y + 30 });
    checks.guardianInterrupted = z.phase === "recover";
    const ally = makeStageZombie({
      x: 500,
      floor: GROUND_Y,
      lo: 450,
      hi: 650,
      type: "rootbound",
    });
    z.phase = "channel";
    checks.guardianProtects =
      damageStageZombie(ally, { damage: 2, vx: 1, y: ally.y }) === 1;
    damageStageZombie(z, { damage: 1, vx: 1, y: z.y });
    checks.guardianProtectionEnds =
      damageStageZombie(ally, { damage: 2, vx: 1, y: ally.y }) === 2;
    h = level.stagecraft.hazards.find((h) => h.type === "resonance");
    h.pads[0].enabled = false;
    resetStagecraft(level, true);
    checks.checkpointRestores = h.pads[0].enabled && stageAlive().length === 0;
    resetStageBossAtCheckpoint();
    checks.bossReset =
      finalBoss.active && !finalBoss.awakened && finalBoss.hp === 1200;
    level.journey.goals = [true, true, true];
    place(level.bossArena.trigger + 40);
    updateFinalBoss(16);
    checks.bossNeedsSeals = !finalBoss.awakened;
    for (const h of level.stagecraft.hazards)
      if (h.type === "seal") h.done = true;
    place(level.bossArena.trigger + 40);
    updateFinalBoss(16);
    checks.bossAwakens = finalBoss.awakened;
    finalBoss.hp = 0;
    updateFinalBoss(16);
    checks.bossDies = finalBoss.dead;
    levelClear();
    checks.finishUnlocks = state.mode === "levelclear";
    load(19);
    for (const seal of level.stagecraft.hazards)
      if (seal.type === "seal") seal.done = true;
    place(level.bossArena.start + 580);
    finalBoss.awakened = true;
    finalBoss.hp = 700;
    finalBoss.pendingAttack = { type: "meteor", timer: 1 };
    finalBoss.projectiles = [
      { x: 8100, y: 300, vx: 0, vy: 4, life: 10, size: 13 },
    ];
    updateStageBossReinforcements(16);
    checks.phaseTransitionClearsAttacks =
      !finalBoss.pendingAttack && finalBoss.projectiles.length === 0;
    checks.reinforcementBound =
      stageAlive("world-eater").length === 1 &&
      stageAlive().length <= stageTuning().cap;
    updateEndgameBossAttacks(finalBoss, 5000);
    checks.noBossAttackDuringAdds = !finalBoss.pendingAttack;
    level.stagecraft.time = 10000;
    updateStageBossReinforcements(16);
    checks.reinforcementWindowEnds = stageAlive("world-eater").length === 0;
    load(16);
    h = level.stagecraft.hazards.find((h) => h.type === "train");
    place(h.x - 100, h.y - 45);
    player.invuln = 0;
    state.lives = 8;
    keys.ArrowRight = true;
    keys.Space = true;
    for (let i = 0; i < 42; i++) {
      state.time += 16.67;
      updatePlayer(16.67);
      keys.Space = false;
      updateEndgame(16.67);
    }
    keys.ArrowRight = false;
    checks.trainBoardWithNormalJump =
      state.lives === 8 && player.onGround && player.y + player.h <= h.y - 100;
    load(14);
    h = level.stagecraft.hazards.find((h) => h.type === "vine");
    place(h.x + h.w / 2, h.y, 24);
    player.invuln = 0;
    state.lives = 8;
    h.clock = h.period * stageTuning().warning * 0.75;
    prepareStagecraft(0);
    updateStagecraft(0);
    checks.vineDuckClearance = state.lives === 8;
    load(14);
    place(250);
    let target = makeStageZombie({
      x: 350,
      floor: GROUND_Y,
      lo: 320,
      hi: 520,
      type: "rootbound",
    });
    target.phase = "recover";
    target.timer = 5000;
    const requiredHits = target.maxHealth;
    for (let i = 0; i < requiredHits; i++) {
      bullets.push({
        x: target.x - 5,
        y: target.y + 25,
        vx: 10,
        vy: 0,
        size: 4,
        damage: 1,
        life: 20,
      });
      updateBullets();
    }
    updateZombies(16);
    checks.nativeBulletsKill = target.phase === "dead";
    load(19);
    checks.noSpawnInsideBarricade = !stageSpawnSafe({
      x: 530,
      floor: GROUND_Y,
    });
    checks.noSpawnInsideClosedDoor = !stageSpawnSafe({
      x: 3125,
      floor: GROUND_Y,
    });
    checks.noSpawnInsideWindmill = !stageSpawnSafe({
      x: 2940,
      floor: GROUND_Y,
    });
    checks.guardianHasClearArrival = stageSpawnSafe({
      x: 700,
      floor: GROUND_Y,
    });
    load(16);
    h = level.stagecraft.hazards.find((h) => h.type === "junction");
    checks.noSpawnOnPoweredFloor = !stageSpawnSafe({
      x: h.x + h.w * 0.75,
      floor: h.y,
    });
    activateStageSwitch(h);
    checks.spawnWindowAfterPowerSwitch = stageSpawnSafe({
      x: h.x + h.w * 0.75,
      floor: h.y,
    });
    for (const n of [14, 16]) {
      load(n);
      const route = level.clockRoutes[0];
      const bridges = level.plats.filter((p) => p.adventureBridge);
      checks["bridgeStartsClosed" + n] = bridges.every((p) => !p.enabled);
      place(route.x);
      updateAdventureRoutes(16);
      checks["bridgeOpens" + n] =
        bridges.every((p) => p.enabled) && route.remaining === 10000;
      updateAdventureRoutes(1000);
      checks["bridgeTimerRunsWhileStanding" + n] = route.remaining === 9000;
      route.remaining = 1;
      updateAdventureRoutes(16);
      checks["bridgeExpires" + n] = bridges.every((p) => !p.enabled);
      const chest = level.treasures[0];
      place(chest.x, chest.y + chest.h);
      state.lives = 6;
      const before = { score: state.score, coins: state.coinsCollected };
      updateAdventureRoutes(16);
      checks["chestReward" + n] =
        chest.taken &&
        state.score === before.score + 500 &&
        state.coinsCollected === before.coins + 15 &&
        state.lives === 7;
      updateAdventureRoutes(16);
      checks["chestOnlyOnce" + n] = state.score === before.score + 500;
    }
    for (const n of [0, 5, 13]) {
      load(n);
      checks["earlierLevel" + n] = !level.stagecraft;
      updatePlayer(16);
      updateZombies(16);
    }
    return { checks, info };
  });
  console.log(JSON.stringify({ ...report, errors }, null, 2));
  await browser.close();
  assert.equal(errors.length, 0);
  assert.deepEqual(
    Object.entries(report.checks).filter(([, v]) => !v),
    [],
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
