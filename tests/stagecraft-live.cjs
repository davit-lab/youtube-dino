/* Smoke test with the real requestAnimationFrame loop and keyboard input. */
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
  });
  const errors = [],
    scenes = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.GAME_URL || "http://localhost:3000");
  await page.waitForFunction(
    () => typeof LEVELS !== "undefined" && LEVELS.length >= 20,
  );
  await page.evaluate(() => {
    state.settings.sfxVolume = 0;
    state.settings.musicVolume = 0;
    const update = updateStagecraft;
    window.stageSample = { frames: 0, total: 0, max: 0 };
    updateStagecraft = function (dt) {
      const start = performance.now();
      update(dt);
      const elapsed = performance.now() - start;
      stageSample.frames++;
      stageSample.total += elapsed;
      stageSample.max = Math.max(stageSample.max, elapsed);
    };
  });
  for (const scene of [
    { n: 14, x: 7930 },
    { n: 15, x: 10220 },
    { n: 16, x: 3760 },
    { n: 17, x: 7470 },
    { n: 18, x: 4720 },
    { n: 19, x: 4250 },
  ]) {
    await page.evaluate(({ n, x }) => {
      loadLevel(n);
      state.mode = "playing";
      state.settings.difficulty = "normal";
      state.lives = 8;
      const h = level.stagecraft.hazards.find((h) => h.crossing);
      resetPlayer({ x, y: h.crossing.entry.y - 54 });
      player.onGround = true;
      player.invuln = 99999;
      camX = Math.max(0, x - W * 0.38);
      camY = 0;
      stageSample = { frames: 0, total: 0, max: 0 };
    }, scene);
    await page.keyboard.down("ArrowRight");
    await page.keyboard.down("Space");
    await page.waitForTimeout(350);
    await page.keyboard.up("Space");
    await page.waitForTimeout(450);
    await page.keyboard.up("ArrowRight");
    await page.waitForTimeout(1200);
    scenes.push(
      await page.evaluate(() => ({
        level: state.levelIndex + 1,
        frames: stageSample.frames,
        meanUpdateMs: stageSample.total / Math.max(1, stageSample.frames),
        maxUpdateMs: stageSample.max,
        finitePlayer: Number.isFinite(player.x) && Number.isFinite(player.y),
        finitePlatforms: level.plats.every(
          (p) => Number.isFinite(p.x) && Number.isFinite(p.y),
        ),
        alive: stageAlive().length,
        cap: stageTuning().cap,
        mode: state.mode,
      })),
    );
  }
  console.log(JSON.stringify({ scenes, errors }, null, 2));
  await browser.close();
  assert.deepEqual(errors, []);
  for (const s of scenes) {
    assert.ok(s.frames >= 20, `Level ${s.level}: animation loop ran`);
    assert.ok(s.finitePlayer && s.finitePlatforms);
    assert.ok(s.alive <= s.cap);
    assert.equal(s.mode, "playing");
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
