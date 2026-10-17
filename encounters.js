/* Authored encounters for episodes 15–20. All distances are world pixels. */
const ADVENTURE_ENCOUNTER_TYPES = [
  "log",
  "mud",
  "ice",
  "cart",
  "electric",
  "fan",
  "windmill",
  "piston",
  "barricade",
  "sluice",
];
function installAdventureEncounters(worlds) {
  const G = GROUND_Y;
  const add = (level, type, x, w = 100, extra = {}) => {
    const o = { type, x, y: G, w, h: 0, period: 4200, phase: 0, ...extra };
    level.encounters.push(o);
    // Replace conflicting old hazards; keep checkpoints and bonus routes.
    const left = x - 100,
      right = x + w + 100;
    level.obstacles = level.obstacles.filter(
      (p) => (p.to || p.x + (p.w || 30)) < left || p.x > right,
    );
    for (const key of ["spikes", "crushers", "steamVents", "firejets"])
      level[key] = (level[key] || []).filter(
        (p) => p.x + (p.w || 30) < left || p.x > right,
      );
    level.zombies = level.zombies.filter((p) => p.x < left || p.x > right);
    if (type === "piston") {
      const platform = {
        x,
        y: G - 12,
        w,
        h: 20,
        oneWay: true,
        vy: -1.1,
        minY: G - 105,
        maxY: G - 12,
        homeX: x,
        homeY: G - 12,
        homeVx: 0,
        homeVy: -1.1,
        encounterPiston: true,
      };
      level.plats.push(platform);
      o.platform = platform;
      level.coins.push(
        ...[0, 1, 2].map((i) => ({
          x: x + 15 + i * 25,
          y: G - 173,
          w: 22,
          h: 22,
          taken: false,
        })),
      );
    }
    return o;
  };
  worlds.forEach((l, i) => {
    l.encounters = [];
    l.wildlife = [];
    l.challengeRank = [2, 3, 3, 4, 4, 5][i];
    l.diffStars = "★".repeat(l.challengeRank);
  });
  const [jungle, sky, neon, cave, volcano, finale] = worlds;
  add(jungle, "log", 1100, 90, { h: 42 });
  add(jungle, "mud", 1260, 155);
  add(jungle, "log", 7430, 90, { h: 28, thorny: true });
  add(sky, "ice", 3250, 145);
  add(sky, "fan", 3790, 240, { dir: -1 });
  add(sky, "windmill", 9700, 140, { radius: 54, period: 6600 });
  add(neon, "barricade", 2110, 62, { h: 90, hp: 3 });
  add(neon, "electric", 8640, 140, { h: 24, period: 4300 });
  add(neon, "ice", 10730, 115);
  add(cave, "cart", 3270, 280, { h: 42, period: 5600 });
  add(cave, "sluice", 5420, 220, { h: 60, period: 5800 });
  add(cave, "piston", 5500, 88);
  add(volcano, "piston", 3360, 110);
  add(volcano, "fan", 7860, 170, { dir: -1, period: 3800 });
  add(volcano, "electric", 10070, 140, { h: 24, period: 3900 });
  add(finale, "barricade", 480, 62, { h: 96, hp: 3 });
  add(finale, "windmill", 2880, 140, { radius: 56, period: 6100 });
  add(finale, "sluice", 6510, 180, { h: 58, period: 5400 });
  installAdventureWildlife(worlds);
}
function encounterTuning() {
  const difficulty = state.settings?.difficulty || "normal";
  return difficulty === "easy"
    ? { speed: 0.78, warning: 1.4, force: 0.75 }
    : difficulty === "hardcore"
      ? { speed: 1.1, warning: 1, force: 1.1 }
      : { speed: 1, warning: 1.15, force: 1 };
}
function resetAdventureEncounters(lvl) {
  for (const o of lvl.encounters || []) {
    o.clock = 0;
    o.active = false;
    o.warning = false;
    o.broken = false;
    o.health = o.hp || 3;
    o.cartX = o.x + o.w - 30;
    o.cartPhase = "waiting";
    o.cartTimer = 0;
    o.iceVx = 0;
    o.wildlifeDisabledUntil = 0;
  }
  for (const p of lvl.plats)
    if (p.encounterPiston) {
      p.y = p.homeY;
      p.vy = p.homeVy;
    }
  resetAdventureWildlife(lvl);
}
function solidEncounter(o) {
  const box = { x: o.x, y: o.y - o.h, w: o.w, h: o.h };
  if (!overlap(player, box)) return;
  if (player.vy >= 0 && player.y + player.h - player.vy <= box.y + 8) {
    player.y = box.y - player.h;
    player.vy = 0;
    player.onGround = true;
  } else if (player.vy < 0 && player.y - player.vy >= box.y + box.h - 5) {
    player.y = box.y + box.h;
    player.vy = 1;
  } else {
    player.x =
      player.x + player.w / 2 < box.x + box.w / 2
        ? box.x - player.w
        : box.x + box.w;
    player.vx = 0;
  }
}
function pointSegmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax,
    dy = by - ay,
    t = Math.max(
      0,
      Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)),
    );
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
function updateAdventureEncounters(dt) {
  if (!level.endgameDesign || player.dead || player.isFalling) return;
  const tune = encounterTuning(),
    step = dt / 16.67;
  for (const o of level.encounters || []) {
    if (Math.abs(player.x - o.x) > 1450) continue;
    o.clock += dt * tune.speed;
    const cycle = (o.clock % o.period) / o.period;
    const disabled = (o.wildlifeDisabledUntil || 0) > level.adventureTime;
    o.warning = !disabled && cycle > 0.38 && cycle < 0.62;
    o.active = !disabled && cycle >= 0.62 && cycle < 0.82;
    const feet = player.y + player.h,
      within = player.x + player.w > o.x && player.x < o.x + o.w;
    if (o.type === "log") {
      if (o.thorny) {
        if (
          overlap(player, { x: o.x + 5, y: o.y - o.h, w: o.w - 10, h: o.h - 3 })
        )
          hurtPlayer("ეკლიანი ტოტები!", "trap");
      } else solidEncounter(o);
    } else if (o.type === "barricade" && !o.broken) solidEncounter(o);
    else if (
      o.type === "mud" &&
      within &&
      player.onGround &&
      Math.abs(feet - o.y) < 8
    ) {
      player.x -= player.vx * 0.38 * step;
      player.vx *= 0.72;
    } else if (o.type === "ice") {
      if (within && player.onGround && Math.abs(feet - o.y) < 8) {
        const desired = player.vx;
        o.iceVx += (desired - o.iceVx) * 0.11;
        player.x += (o.iceVx - desired) * step;
      } else o.iceVx = player.vx;
    } else if (
      o.type === "fan" &&
      within &&
      feet > o.y - 100 &&
      player.y < o.y
    ) {
      if (o.active) player.x += (o.dir || -1) * 1.55 * tune.force * step;
    } else if (
      o.type === "electric" &&
      o.active &&
      overlap(player, { x: o.x + 4, y: o.y - 21, w: o.w - 8, h: 21 })
    )
      hurtPlayer("ელექტრული იატაკი!", "trap");
    else if (
      o.type === "sluice" &&
      o.active &&
      overlap(player, { x: o.x + 4, y: o.y - o.h, w: o.w - 8, h: o.h })
    ) {
      // A flood pushes first; only the narrow, clearly painted intake hurts.
      player.x -= 1.8 * tune.force * step;
      if (overlap(player, { x: o.x + o.w - 25, y: o.y - o.h, w: 21, h: o.h }))
        hurtPlayer("წყლის ნაკადი!", "trap");
    } else if (o.type === "cart") {
      const warning = 950 * tune.warning;
      o.cartTimer += dt;
      if (o.cartPhase === "waiting" && o.cartTimer > 1500) {
        o.cartPhase = "warning";
        o.cartTimer = 0;
      } else if (o.cartPhase === "warning" && o.cartTimer > warning) {
        o.cartPhase = "rolling";
        o.cartTimer = 0;
      } else if (o.cartPhase === "rolling") {
        o.cartX -= 2.7 * tune.speed * step;
        if (overlap(player, { x: o.cartX - 23, y: o.y - 37, w: 46, h: 35 }))
          hurtPlayer("მაღაროს ვაგონი!", "trap");
        if (o.cartX < o.x + 28) {
          o.cartPhase = "waiting";
          o.cartTimer = 0;
          o.cartX = o.x + o.w - 30;
        }
      }
    } else if (o.type === "windmill") {
      o.angle = (o.clock * Math.PI * 2) / o.period;
      const cx = o.x + o.w / 2,
        cy = o.y - 82;
      for (let k = 0; k < 2; k++) {
        const a = o.angle + k * Math.PI,
          ax = cx + Math.cos(a) * 16,
          ay = cy + Math.sin(a) * 16,
          bx = cx + Math.cos(a) * o.radius,
          by = cy + Math.sin(a) * o.radius;
        if (
          pointSegmentDistance(
            player.x + player.w / 2,
            player.y + player.h * 0.55,
            ax,
            ay,
            bx,
            by,
          ) < 15
        )
          hurtPlayer("წისქვილის ფრთები!", "trap");
      }
    }
  }
}
function hitAdventureBarricade(b) {
  if (!level.endgameDesign) return false;
  for (const o of level.encounters || []) {
    if (o.type !== "barricade" || o.broken) continue;
    if (
      overlap(
        {
          x: b.x - (b.size || 4),
          y: b.y - (b.size || 4),
          w: (b.size || 4) * 2,
          h: (b.size || 4) * 2,
        },
        { x: o.x, y: o.y - o.h, w: o.w, h: o.h },
      )
    ) {
      o.health -= Math.max(1, b.damage || 1);
      spawnParticles(b.x, b.y, "#bc9970", 5, 1);
      if (o.health <= 0) {
        o.broken = true;
        spawnParticles(o.x + o.w / 2, o.y - o.h / 2, "#bc9970", 10, 1.5);
        addScore(50);
      }
      return true;
    }
  }
  return false;
}
function drawAdventureEncounters() {
  ctx.save();
  for (const o of level.encounters || []) {
    const x = o.x - camX,
      y = o.y;
    if (x + o.w < -140 || x > W + 140) continue;
    if (o.type === "log") {
      ctx.fillStyle = o.thorny ? "#66764c" : "#765138";
      ctx.fillRect(x, y - o.h, o.w, o.h);
      ctx.fillStyle = "#ae8c59";
      ctx.fillRect(x + 5, y - o.h + 6, o.w - 10, 4);
      ctx.strokeStyle = "#493e2c";
      ctx.lineWidth = 2;
      for (let k = 15; k < o.w; k += 22) {
        ctx.beginPath();
        ctx.moveTo(x + k, y - o.h + 10);
        ctx.lineTo(x + k - 7, y - 5);
        ctx.stroke();
      }
      if (o.thorny) {
        ctx.fillStyle = "#bbc79a";
        for (let k = 4; k < o.w; k += 18) {
          ctx.beginPath();
          ctx.moveTo(x + k, y - o.h + 4);
          ctx.lineTo(x + k + 4, y - o.h - 7);
          ctx.lineTo(x + k + 10, y - o.h + 4);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "#b79462";
        ctx.beginPath();
        ctx.ellipse(
          x + o.w - 9,
          y - o.h / 2,
          8,
          o.h / 2 - 3,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    } else if (o.type === "mud" || o.type === "ice") {
      ctx.fillStyle = o.type === "mud" ? "#534839" : "#91b9bd";
      ctx.fillRect(x, y - 3, o.w, 9);
      ctx.fillStyle = o.type === "mud" ? "#897457" : "#d0e3dd";
      for (let k = 12; k < o.w; k += 28)
        ctx.fillRect(x + k, y + (k % 3) - 2, 13, 2);
    } else if (o.type === "piston") {
      const p = o.platform;
      ctx.fillStyle = "#45565a";
      ctx.fillRect(x + o.w / 2 - 13, p.y + 20, 26, y - p.y - 20);
      ctx.fillStyle = "#a6ae9c";
      ctx.fillRect(x + o.w / 2 - 3, p.y + 20, 6, y - p.y - 20);
      ctx.fillStyle = "#65786b";
      ctx.fillRect(x, p.y, o.w, 20);
      ctx.fillStyle = "#d5c393";
      ctx.fillRect(x, p.y, o.w, 5);
      ctx.fillStyle = "#c1af79";
      for (let k = 8; k < o.w; k += 22) ctx.fillRect(x + k, p.y + 9, 9, 4);
    } else if (o.type === "barricade") {
      if (o.broken) {
        ctx.fillStyle = "#83664a";
        ctx.fillRect(x, y - 6, o.w, 6);
        continue;
      }
      ctx.fillStyle = "#6c5039";
      ctx.fillRect(x, y - o.h, o.w, o.h);
      ctx.fillStyle = "#ac8e61";
      for (let k = 6; k < o.w; k += 17)
        ctx.fillRect(x + k, y - o.h + 5, 11, o.h - 10);
      ctx.fillStyle = "#3d4e4e";
      ctx.fillRect(x - 3, y - o.h + 15, o.w + 6, 8);
      ctx.fillRect(x - 3, y - 23, o.w + 6, 8);
      for (let k = 0; k < o.health; k++) {
        ctx.fillStyle = "#e4d19d";
        ctx.fillRect(x + 16 + k * 10, y - o.h + o.h / 2, 5, 5);
      }
    } else if (o.type === "electric") {
      ctx.fillStyle = "#34484c";
      ctx.fillRect(x, y - 5, o.w, 10);
      for (let k = 7; k < o.w; k += 25) {
        ctx.fillStyle = o.active
          ? "#d8e7c4"
          : o.warning
            ? "#e5b56d"
            : "#718d86";
        ctx.fillRect(x + k, y - 5, 17, 4);
      }
      if (o.active) {
        ctx.strokeStyle = "#d6eabf";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        for (let k = 0; k <= o.w; k += 12)
          ctx.lineTo(x + k, y - 9 - ((k / 12) % 2) * 13);
        ctx.stroke();
      }
    } else if (o.type === "fan") {
      ctx.fillStyle = "#42575a";
      ctx.fillRect(x + o.w - 22, y - 72, 22, 72);
      ctx.strokeStyle = "#b1bbaa";
      ctx.lineWidth = 3;
      ctx.save();
      ctx.translate(x + o.w - 12, y - 50);
      ctx.rotate(o.clock * (o.active ? 0.015 : 0.003));
      for (let k = 0; k < 3; k++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 15);
        ctx.stroke();
      }
      ctx.restore();
      if (o.active || o.warning) {
        ctx.strokeStyle = o.active
          ? "rgba(216,228,211,.65)"
          : "rgba(225,189,124,.4)";
        for (let k = 0; k < 4; k++) {
          const dx = (o.clock * 0.08 + k * 53) % o.w;
          ctx.beginPath();
          ctx.moveTo(x + dx, y - 25 - k * 14);
          ctx.lineTo(x + dx - 28, y - 25 - k * 14);
          ctx.stroke();
        }
      }
    } else if (o.type === "sluice") {
      ctx.fillStyle = "#52615e";
      ctx.fillRect(x + o.w - 20, y - 105, 20, 105);
      ctx.fillStyle = "#a8b6a2";
      ctx.fillRect(x + o.w - 24, y - 80, 26, 10);
      if (o.active) {
        ctx.fillStyle = "rgba(96,160,174,.58)";
        ctx.fillRect(x, y - o.h, o.w, o.h);
        ctx.strokeStyle = "#c1dad7";
        for (let k = 12; k < o.w; k += 37) {
          ctx.beginPath();
          ctx.moveTo(x + k, y - o.h + 7);
          ctx.lineTo(x + k - 16, y - o.h + 10);
          ctx.stroke();
        }
      }
      ctx.fillStyle = o.warning ? "#e4b477" : "#99ad98";
      ctx.fillRect(x + o.w - 13, y - 95, 6, 6);
    } else if (o.type === "cart") {
      ctx.fillStyle = "#697b78";
      ctx.fillRect(x, y - 2, o.w, 4);
      for (let k = 0; k < o.w; k += 28) {
        ctx.fillStyle = "#8c7150";
        ctx.fillRect(x + k, y + 2, 12, 4);
      }
      const cx = o.cartX - camX;
      ctx.fillStyle = "#485b61";
      ctx.beginPath();
      ctx.moveTo(cx - 29, y - 43);
      ctx.lineTo(cx + 29, y - 43);
      ctx.lineTo(cx + 22, y - 9);
      ctx.lineTo(cx - 22, y - 9);
      ctx.fill();
      ctx.fillStyle = "#b1b1a0";
      ctx.fillRect(cx - 29, y - 43, 58, 5);
      ctx.fillStyle = "#293b40";
      for (const k of [-17, 17]) {
        ctx.beginPath();
        ctx.arc(cx + k, y - 8, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      if (o.cartPhase === "warning") {
        ctx.fillStyle = "#e3bc7c";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("← CART", cx, y - 58);
      }
    } else if (o.type === "windmill") {
      const cx = x + o.w / 2,
        cy = y - 82;
      ctx.fillStyle = "#6d725e";
      ctx.fillRect(cx - 9, cy, 18, 82);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(o.angle || 0);
      ctx.fillStyle = "#ad9b76";
      ctx.fillRect(-o.radius, -7, o.radius * 2, 14);
      ctx.fillStyle = "#e3cf9b";
      ctx.fillRect(-o.radius, -7, 21, 14);
      ctx.fillRect(o.radius - 21, -7, 21, 14);
      ctx.fillStyle = "#4b5d5a";
      ctx.fillRect(-9, -9, 18, 18);
      ctx.restore();
    }
    // Physical signposts introduce each encounter without interrupting play.
    const labels = {
      log: o.thorny ? "JUMP" : "HOP OVER",
      mud: "MUD · JUMP",
      ice: "ICE · BRAKE EARLY",
      cart: "JUMP THE CART",
      electric: o.warning ? "CHARGING" : o.active ? "JUMP" : "FLOOR OFF",
      fan: o.warning ? "WIND RISING" : "WIND TUNNEL",
      windmill: "DUCK / WAIT",
      piston: "RIDE THE LIFT",
      barricade: "SHOOT / JUMP",
      sluice: o.warning ? "WATER RISING" : "WAIT / HIGH ROUTE",
    };
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    const label = labels[o.type] || "";
    const signY = y - (o.h || 0) - 19;
    const signW = Math.ceil(ctx.measureText(label).width) + 12;
    ctx.fillStyle = "#52615a";
    ctx.fillRect(x + o.w / 2 - 2, signY + 3, 4, 12);
    ctx.fillStyle = "#263a3e";
    ctx.fillRect(x + o.w / 2 - signW / 2, signY - 11, signW, 17);
    ctx.fillStyle = "#d2c39e";
    ctx.fillText(label, x + o.w / 2, signY + 1);
  }
  ctx.restore();
}
function drawAdventureWildlife() {
  ctx.save();
  for (const a of level.wildlife || []) {
    const sx = a.x - camX;
    if (sx < -100 || sx > W + 100) continue;
    drawWildlifeDetails(a);
    const t = a.flightTime,
      fly = a.species === "bird" || a.species === "bat",
      bob =
        fly && a.phase !== "swoop" && a.phase !== "warn"
          ? Math.sin(t * 0.003 + a.homeX) * 5
          : 0;
    ctx.save();
    ctx.translate(sx, a.y + bob);
    ctx.scale(a.facing, 1);
    if (fly) {
      const bat = a.species === "bat",
        wing = Math.sin(t * (bat ? 0.014 : 0.009)) * 12;
      ctx.fillStyle = bat ? "#82778a" : "#c3c5ac";
      ctx.beginPath();
      ctx.moveTo(-3, -6);
      ctx.lineTo(-23, -12 - wing);
      ctx.lineTo(-15, -2);
      ctx.lineTo(-3, 1);
      ctx.lineTo(15, -2);
      ctx.lineTo(23, -12 - wing);
      ctx.lineTo(3, -6);
      ctx.fill();
      ctx.fillStyle = bat ? "#423e53" : "#63776f";
      ctx.fillRect(-4, -9, 8, 13);
      ctx.fillStyle = "#c9a774";
      ctx.fillRect(4, -8, 6, 3);
    } else if (a.species === "deer") {
      ctx.fillStyle = "#a4855e";
      ctx.fillRect(-25, -35, 40, 20);
      ctx.fillRect(10, -48, 11, 27);
      ctx.fillRect(15, -51, 20, 12);
      ctx.fillStyle = "#c8b390";
      const stride = Math.abs(a.vx) > 5 ? Math.sin(a.anim) * 5 : 0;
      ctx.fillRect(-17 + stride, -15, 5, 15);
      ctx.fillRect(8 - stride, -15, 5, 15);
      ctx.fillRect(19, -60, 5, 11);
      ctx.strokeStyle = "#b8a580";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(18, -51);
      ctx.lineTo(10, -66);
      ctx.lineTo(4, -69);
      ctx.moveTo(11, -63);
      ctx.lineTo(15, -69);
      ctx.stroke();
    } else if (a.species === "rabbit") {
      const hop =
        Math.abs(a.vx) > 5
          ? Math.abs(Math.sin(a.anim)) * 9
          : a.phase === "work"
            ? Math.abs(Math.sin(t * 0.025)) * 2
            : 0;
      ctx.translate(0, -hop);
      ctx.fillStyle = "#b8b29a";
      ctx.fillRect(-14, -20, 23, 16);
      ctx.fillRect(5, -28, 13, 15);
      ctx.fillRect(7, -42, 4, 16);
      ctx.fillRect(14, -39, 4, 14);
      ctx.fillStyle = "#d5cdb3";
      ctx.fillRect(-16, -7, 12, 7);
      ctx.fillRect(8, -6, 10, 6);
      ctx.fillRect(-19, -16, 7, 7);
    } else {
      ctx.fillStyle = "#a0ac70";
      ctx.fillRect(-17, -12, 28, 9);
      ctx.fillRect(10, -15, 12, 8);
      ctx.fillRect(-31, -8, 17, 4);
      ctx.fillRect(-9, -3, 5, 3);
      ctx.fillRect(7, -3, 5, 3);
    }
    ctx.fillStyle = "#293d35";
    if (!fly)
      ctx.fillRect(
        a.species === "deer" ? 28 : a.species === "rabbit" ? 14 : 17,
        a.species === "deer" ? -47 : a.species === "rabbit" ? -24 : -13,
        2,
        2,
      );
    ctx.restore();
  }
  ctx.restore();
}
