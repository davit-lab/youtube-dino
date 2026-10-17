/* Authored machinery layered onto the existing maps and native platform engine. */
const STAGE_MECHANICS = [
  "tilt",
  "waterfall",
  "vine",
  "ring",
  "bell",
  "counterweight",
  "train",
  "crane",
  "junction",
  "bucket",
  "drill",
  "crystal",
  "tide",
  "slag",
  "steam",
  "beam",
  "resonance",
  "seal",
];
function stageTuning() {
  return state.settings.difficulty === "easy"
    ? { warning: 1.45, speed: 0.8, window: 1.3, cap: 5, wave: 1 }
    : state.settings.difficulty === "hardcore"
      ? { warning: 1, speed: 1.08, window: 0.9, cap: 8, wave: 3 }
      : { warning: 1.2, speed: 1, window: 1.1, cap: 7, wave: 2 };
}
function installStagecraft(worlds) {
  const G = GROUND_Y;
  for (const l of worlds) {
    l.stagecraft = { hazards: [], spawns: [], time: 0 };
  }
  const pad = (l, x, y, w, extra = {}) => {
    const p = {
      x,
      y,
      w,
      h: 22,
      oneWay: true,
      stagecraft: true,
      enabled: true,
      ...extra,
    };
    p.restX = x;
    p.restY = y;
    l.plats.push(p);
    return p;
  };
  const clear = (l, x, w) => {
    // Existing landmarks, checkpoints, rewards and animal-controlled hazards stay.
    const protectedTraps = new Set(
      l.wildlife.map((a) => a.trap).filter(Boolean),
    );
    l.obstacles = l.obstacles.filter(
      (o) =>
        protectedTraps.has(o) ||
        (o.to || o.x + (o.w || 30)) < x - 50 ||
        o.x > x + w + 50,
    );
    for (const k of ["spikes", "crushers", "firejets"])
      l[k] = (l[k] || []).filter(
        (o) => o.x + (o.w || 30) < x - 20 || o.x > x + w + 20,
      );
    l.zombies = l.zombies.filter((z) => z.x < x - 100 || z.x > x + w + 100);
  };
  const add = (i, type, x, y = G, w = 260, extra = {}) => {
    const l = worlds[i],
      h = {
        id: `${i}-${l.stagecraft.hazards.length}`,
        type,
        x,
        y,
        w,
        height: 210,
        clock: 0,
        period: 6400,
        offset: 0,
        ...extra,
      };
    l.stagecraft.hazards.push(h);
    if (type !== "seal") clear(l, x, w);
    if (type === "ring") {
      // Give the wheel a real opening; retained approach/dismount ledges frame it.
      const left = x - 20,
        right = x + w + 20;
      l.plats = l.plats.flatMap((p) => {
        if (p.stagecraft || p.vx || p.vy || p.x + p.w <= left || p.x >= right)
          return [p];
        const pieces = [];
        if (left - p.x >= 70) pieces.push({ ...p, w: left - p.x });
        if (p.x + p.w - right >= 70)
          pieces.push({ ...p, x: right, w: p.x + p.w - right });
        return pieces;
      });
    }
    h.pads = [];
    if (type === "tilt")
      h.pads.push(pad(l, x, y - 72, w, { stageSlope: true, angle: 0 }));
    if (type === "ring")
      for (let k = 0; k < 4; k++)
        h.pads.push(pad(l, x + w / 2 - 54, y - 110, 108, { orbit: k }));
    if (type === "counterweight") {
      h.pads.push(pad(l, x, y - 90, 130));
      h.pads.push(pad(l, x + w - 130, y - 90, 130));
    }
    if (type === "bucket") h.pads.push(pad(l, x, y - 65, 150));
    if (type === "crane")
      h.pads.push(pad(l, x, y - 104, 156, { h: 104, oneWay: false }));
    if (["crystal", "slag", "resonance", "steam"].includes(type)) {
      for (let k = 0; k < 3; k++)
        h.pads.push(pad(l, x + k * 150, y - 65 - (k % 2) * 20, 120));
    }
    if (["train", "tide", "junction"].includes(type)) {
      // Accessible raised crossings and rest ledges; no mandatory damage.
      for (let k = 0; k < Math.ceil(w / 160); k++)
        h.pads.push(pad(l, x + k * 160, y - 105, 135));
      pad(l, x - 130, y - 45, 100);
      pad(l, x + w + 30, y - 45, 100);
    }
    if (
      [
        "tilt",
        "waterfall",
        "bucket",
        "crystal",
        "slag",
        "steam",
        "resonance",
        "ring",
      ].includes(type)
    ) {
      // Visible lower recovery route, with steps back to the original journey.
      pad(l, x - 50, y + 32, w + 100, { recovery: true });
      pad(l, x + w - 30, y - 20, 110, { recovery: true });
    }
    if (type === "resonance") {
      // The center pier makes the timed surfaces part of the crossing.
      const pier = pad(l, x + 175, y - 164, 70, {
        h: 164,
        oneWay: false,
        stagePier: true,
      });
      h.pads[1].y = h.pads[1].restY = y - 164;
    }
    if (type === "ring") {
      l.coinBags = l.coinBags || [];
      l.coinBags.push({
        x: x + w / 2 - 13,
        y: y - 255,
        w: 26,
        h: 26,
        taken: false,
      });
    }
    if (type === "vine")
      h.anchor = { x: x + w / 2 - 16, y: y - 106, w: 32, h: 32 };
    if (["junction", "steam"].includes(type))
      h.switch = { x: x - 62, y: y - 56, w: 32, h: 48 };
    if (type === "junction")
      h.relay = { x: x + w / 2 - 16, y: y - 56, w: 32, h: 48 };
    // A reward arc gives the machinery a reason to ride, beyond its lower route.
    for (const p of h.pads)
      l.coins.push({
        x:
          type === "ring"
            ? x + 80 + h.pads.indexOf(p) * 50
            : p.restX + p.w / 2 - 11,
        y: type === "ring" ? y - 250 : p.restY - 48,
        w: 22,
        h: 22,
        taken: false,
      });
    return h;
  };
  // Each mechanic has a quiet introduction, a development, and a combination.
  add(0, "vine", 960, G, 230);
  add(0, "tilt", 1640, G - 20, 280);
  add(0, "waterfall", 2260, G - 90, 95);
  add(0, "vine", 3860, G, 290);
  add(0, "tilt", 5530, G - 70, 280);
  add(0, "waterfall", 6150, G - 120, 110);
  add(0, "tilt", 8010, G, 290);
  add(0, "waterfall", 8150, G, 100);
  add(0, "vine", 10100, G, 260);
  add(1, "ring", 1120, G - 90, 320);
  add(1, "bell", 3050, G, 310);
  add(1, "counterweight", 3600, G, 340);
  add(1, "ring", 4770, G - 60, 320);
  add(1, "bell", 5610, G, 300);
  add(1, "counterweight", 7550, G, 350);
  add(1, "ring", 8700, G - 60, 320);
  add(1, "bell", 9570, G, 300);
  add(1, "counterweight", 10300, G, 340);
  add(2, "junction", 980, G, 360);
  add(2, "crane", 2820, G, 340);
  add(2, "train", 2140, G, 420);
  add(2, "crane", 3840, G, 340);
  add(2, "junction", 6510, G, 420);
  add(2, "train", 7480, G, 420);
  add(2, "junction", 8710, G, 420);
  add(2, "crane", 10070, G, 340);
  add(2, "train", 11000, G, 390);
  add(3, "bucket", 1020, G - 30, 360);
  add(3, "drill", 3020, G, 470);
  add(3, "crystal", 3850, G, 420);
  add(3, "bucket", 4630, G - 60, 360);
  add(3, "drill", 6320, G - 70, 470);
  add(3, "crystal", 7550, G, 420);
  add(3, "drill", 8370, G, 470);
  add(3, "crystal", 8820, G, 420);
  add(3, "bucket", 10240, G, 360);
  add(4, "tide", 1060, G - 20, 440);
  add(4, "slag", 2150, G - 70, 420);
  add(4, "steam", 3090, G, 420);
  add(4, "tide", 3950, G, 440);
  add(4, "slag", 4800, G - 40, 420);
  add(4, "steam", 6750, G - 20, 420);
  add(4, "tide", 8400, G - 40, 440);
  add(4, "slag", 8790, G - 40, 420);
  add(4, "steam", 9870, G, 420);
  add(5, "beam", 850, G, 310);
  add(5, "resonance", 1740, G, 420);
  add(5, "seal", 2560, G, 540, { doorId: "seal-one", switchX: 2780 });
  add(5, "beam", 3640, G - 80, 310);
  add(5, "resonance", 4330, G, 420);
  add(5, "beam", 6230, G, 310);
  add(5, "resonance", 6680, G, 420);
  add(5, "seal", 6710, G, 530, { doorId: "seal-two", switchX: 6970 });
  // Compact pre-arena exam; the last checkpoint and supplies remain untouched.
  add(5, "tilt", 5640, G - 20, 250);
  add(5, "drill", 7070, G, 260, { columns: 2 });
  for (const l of worlds) {
    for (const o of l.encounters) {
      if (o.type === "log") {
        o.h = o.thorny ? 42 : 48;
        o.w = Math.max(o.w, 115);
      }
      if (o.type === "barricade") {
        o.h = 48;
        o.w = 135;
      }
    }
    // Native crates are substantial, jumpable stacks; crawl clearance stays 36px.
    for (const o of l.obstacles) {
      if (o.kind === "crate") {
        o.w = 100;
        o.h = 46;
        o.y = G - 46;
      }
    }
    // Avoid old barrel machinery sharing a new train/drill crossing.
    for (const lane of l.barrelLanes || [])
      lane.stageSuppressed = l.stagecraft.hazards.some(
        (h) =>
          ["train", "drill"].includes(h.type) &&
          h.x < lane.x &&
          h.x + h.w > lane.minX,
      );
  }
  refineStageRoutes(worlds, pad);
  for (const l of worlds)
    for (const p of l.plats)
      if (p.stagecraft)
        p.stageAux = !l.stagecraft.hazards.some((h) => h.pads.includes(p));
  for (const l of worlds)
    for (const a of l.wildlife) {
      if (
        a.species === "bird" &&
        !l.plats.some(
          (p) =>
            p.y === a.rewardY &&
            a.rewardX >= p.x + 10 &&
            a.rewardX <= p.x + p.w - 10,
        )
      ) {
        const p = l.plats.find(
          (p) => p.recovery && a.homeX >= p.x + 12 && a.homeX <= p.x + p.w - 12,
        );
        if (p) {
          a.rewardX = a.homeX;
          a.rewardY = p.y;
        }
      }
    }
  installStageZombies(worlds);
}

function refineStageRoutes(worlds, pad) {
  // Later encounters change the rhythm after the first, generous introduction.
  for (const l of worlds) {
    const counts = {};
    for (const h of l.stagecraft.hazards) {
      h.lesson = counts[h.type] || 0;
      counts[h.type] = h.lesson + 1;
      h.tempo = 1 + Math.min(2, h.lesson) * 0.07;
      h.direction = h.type === "ring" && h.lesson === 1 ? -1 : 1;
      h.floorDuration = 1 - Math.min(2, h.lesson) * 0.08;
    }
  }
  // A deliberate crossing in each world: keep elevated landmarks and checkpoint
  // islands, cut only the redundant ground beneath the moving/timed surfaces.
  const crossings = [8010, 10300, 3840, 7550, 4800, 4330];
  worlds.forEach((l, i) => {
    const h = l.stagecraft.hazards.find((h) => h.x === crossings[i]);
    const left = h.x + 8,
      right = h.x + h.w - 8;
    const islands = l.checkpoints
      .filter((c) => c.x > left - 90 && c.x < right + 90)
      .map((c) => ({ left: c.x - 70, right: c.x + 90 }));
    l.plats = l.plats.flatMap((p) => {
      if (
        p.stagecraft ||
        p.vx ||
        p.vy ||
        p.y < h.y - 35 ||
        p.x + p.w <= left ||
        p.x >= right
      )
        return [p];
      const kept = [
        { left: p.x, right: Math.min(left, p.x + p.w) },
        ...islands.map((s) => ({
          left: Math.max(p.x, left, s.left),
          right: Math.min(p.x + p.w, right, s.right),
        })),
        { left: Math.max(right, p.x), right: p.x + p.w },
      ];
      return kept
        .filter((s) => s.right - s.left >= 24)
        .map((s) => ({ ...p, x: s.left, w: s.right - s.left }));
    });
    // Two broad catch ledges with a normal-jump gap. Missing the upper route
    // costs time; it does not immediately cost a life. Keep the exit step.
    l.plats = l.plats.filter(
      (p) => !(p.recovery && p.w >= 200 && p.x < right && p.x + p.w > left),
    );
    const catchY = Math.min(GROUND_Y + 32, h.y + 32);
    const center = h.x + h.w / 2;
    pad(l, h.x - 55, catchY, center - 40 - (h.x - 55), { recovery: true });
    pad(l, center + 40, catchY, h.x + h.w + 55 - (center + 40), {
      recovery: true,
    });
    if (
      !l.plats.some(
        (p) => p.recovery && p.x >= h.x + h.w - 35 && p.x <= h.x + h.w,
      )
    )
      pad(l, h.x + h.w - 30, h.y - 20, 110, { recovery: true });
    const entry = pad(l, h.x - 85, catchY - 60, 95, { recovery: true });
    h.crossing = { left, right, catchY, entry };
    const end = h.pads[h.pads.length - 1];
    l.coinBags = l.coinBags || [];
    l.coinBags.push({
      x: h.x + h.w - 65,
      y: end.restY - 45,
      w: 26,
      h: 26,
      taken: false,
    });
  });
}

function stageFloorLimit(h) {
  return (
    (h.type === "slag" ? 2400 : 1400) *
    stageTuning().window *
    (h.floorDuration || 1)
  );
}

function resetStagecraft(lvl, checkpoint = false) {
  if (!lvl?.stagecraft) return;
  lvl.stagecraft.resetSerial = (lvl.stagecraft.resetSerial || 0) + 1;
  lvl.stagecraft.time = 0;
  lvl.stagecraft.shots = [];
  for (const h of lvl.stagecraft.hazards) {
    if (h.type === "seal" && checkpoint && h.done) continue;
    Object.assign(h, {
      clock: 0,
      angle: 0,
      weight: h.type === "counterweight" ? 55 : 0,
      disabled: 0,
      charge: 0,
      open: 0,
      selected: 0,
      inside: false,
      warning: false,
      active: false,
      broken: 0,
      shots: [],
      trainX: h.x - h.w,
      signal: false,
      fired: false,
      receiverWasHit: false,
      debounce: 0,
      safeUntil: 0,
    });
    if (h.type === "seal") {
      h.started = false;
      h.done = false;
      h.wave = 0;
      h.wait = 0;
      const d = lvl.doors.find((d) => d.id === h.doorId);
      if (d) d.open = false;
      const b = lvl.switches.find((b) => b.id === h.doorId);
      if (b) b.pressed = false;
    }
    for (const station of [h.switch, h.relay].filter(Boolean))
      station.inside = false;
    for (const p of h.pads) {
      p.x = p.restX;
      p.y = p.restY;
      p.enabled = true;
      p.angle = 0;
      p.life = 0;
      p.broken = 0;
      if (h.type === "ring") {
        const a = (p.orbit * Math.PI) / 2;
        p.x = h.x + h.w / 2 + Math.cos(a) * 105 - p.w / 2;
        p.y = h.y - 120 + Math.sin(a) * 100;
      }
      if (h.type === "bucket") {
        p.x = h.x + h.w / 2 - p.w / 2;
        p.y = h.y - 60;
      }
    }
  }
  if (checkpoint) {
    bullets.length = 0;
    lvl.trapShots = [];
    lvl.boulders = [];
    for (const o of lvl.obstacles) {
      o.phase = "idle";
      o.timer = 0;
      o.dropY = o.y;
      o.lastBurst = -1;
      o.active = false;
      o.warning = false;
      o.pressY = o.y;
    }
    for (const lane of lvl.barrelLanes || []) {
      lane.phase = "idle";
      lane.timer = 0;
    }
    for (const route of lvl.clockRoutes || []) route.remaining = 0;
    for (const p of lvl.plats) {
      if (p.adventureBridge) p.enabled = false;
      if (!p.stagecraft && p.homeX !== undefined) {
        p.x = p.homeX;
        p.y = p.homeY;
        p.vx = p.homeVx || 0;
        if (p.homeVy !== undefined) p.vy = p.homeVy;
      }
    }
    for (const p of lvl.crumblingPlats || []) {
      p.broken = false;
      p.stepped = false;
      p.stepTimer = 0;
      p.respawnTimer = 0;
    }
    for (const o of lvl.encounters) {
      o.clock = 0;
      o.active = false;
      o.warning = false;
      o.cartPhase = "waiting";
      o.cartTimer = 0;
      o.cartX = o.x + o.w - 30;
    }
  }
  resetStageEnemies(lvl, checkpoint);
  resetJourney(lvl, checkpoint);
}
function stageSurface(p, x) {
  return (
    p.y + (p.stageSlope ? Math.tan(p.angle || 0) * (x - p.x - p.w / 2) : 0)
  );
}
function stageStanding(p) {
  return (
    p.enabled !== false &&
    player.onGround &&
    player.x + player.w > p.x + 3 &&
    player.x < p.x + p.w - 3 &&
    Math.abs(player.y + player.h - stageSurface(p, player.x + player.w / 2)) < 8
  );
}
function stageMovePad(p, x, y, angle = 0) {
  const riding = stageStanding(p),
    oldSurface = stageSurface(p, player.x + player.w / 2),
    dx = x - p.x;
  p.x = x;
  p.y = y;
  p.angle = angle;
  if (riding) {
    player.x += dx;
    player.y += stageSurface(p, player.x + player.w / 2) - oldSurface;
  }
}
function collideStageSlope(p) {
  if (player.x + player.w <= p.x || player.x >= p.x + p.w) return;
  const surface = stageSurface(
    p,
    Math.max(p.x, Math.min(p.x + p.w, player.x + player.w / 2)),
  );
  if (
    player.vy >= 0 &&
    player.y + player.h >= surface &&
    player.y + player.h - player.vy <= surface + 10
  ) {
    player.y = surface - player.h;
    player.vy = 0;
    player.onGround = true;
  }
}
function prepareStagecraft(dt) {
  if (!level?.stagecraft || player.dead || player.isFalling) return;
  dt = Math.min(33, Math.max(0, dt));
  const tune = stageTuning();
  level.stagecraft.time += dt;
  for (const h of level.stagecraft.hazards) {
    if (Math.abs(player.x - h.x) > 1900) continue;
    h.clock += dt * tune.speed * (h.tempo || 1);
    h.disabled = Math.max(0, h.disabled - dt);
    h.open = Math.max(0, h.open - dt);
    const period = h.period * tune.warning,
      c = (h.clock % period) / period;
    h.warning = c > 0.43 && c < 0.66;
    h.active = c >= 0.66 && c < 0.85 && h.disabled === 0;
    h.cycle = c;
    if (h.type === "tilt") {
      const p = h.pads[0],
        weight = stageStanding(p)
          ? Math.max(
              -1,
              Math.min(
                1,
                (player.x + player.w / 2 - h.x - h.w / 2) / (h.w / 2),
              ),
            )
          : 0;
      h.angle += (weight * 0.18 - h.angle) * (1 - Math.exp(-dt / 600));
      stageMovePad(p, p.restX, p.restY, h.angle);
    } else if (h.type === "ring") {
      h.angle = h.clock * 0.00034 * (h.direction || 1);
      h.pads.forEach((p, k) => {
        const a = h.angle + (k * Math.PI) / 2;
        stageMovePad(
          p,
          h.x + h.w / 2 + Math.cos(a) * 105 - p.w / 2,
          h.y - 120 + Math.sin(a) * 100,
        );
      });
    } else if (h.type === "counterweight") {
      const a = h.pads[0],
        b = h.pads[1],
        dir = stageStanding(a) ? 1 : stageStanding(b) ? -1 : 0;
      h.weight = Math.max(0, Math.min(110, h.weight + dir * dt * 0.065));
      stageMovePad(a, a.restX, h.y - 145 + h.weight);
      stageMovePad(b, b.restX, h.y - 35 - h.weight);
    } else if (h.type === "bucket") {
      h.angle = Math.sin(h.clock * 0.0005) * 0.55;
      const p = h.pads[0];
      stageMovePad(
        p,
        h.x + h.w / 2 + Math.sin(h.angle) * 210 - p.w / 2,
        h.y - 250 + Math.cos(h.angle) * 190,
      );
    } else if (h.type === "crane") {
      const p = h.pads[0],
        u = (h.clock % 8400) / 8400;
      const across =
        u < 0.2
          ? 0
          : u < 0.5
            ? (u - 0.2) / 0.3
            : u < 0.7
              ? 1
              : 1 - (u - 0.7) / 0.3;
      const lift =
        u < 0.2 ? u / 0.2 : u < 0.5 ? 1 : u < 0.7 ? 1 - (u - 0.5) / 0.2 : 0;
      stageMovePad(p, h.x + across * (h.w - p.w), h.y - 104 - lift * 100);
    } else if (["crystal", "slag"].includes(h.type)) {
      for (const p of h.pads) {
        if (p.broken > 0) {
          p.broken -= dt;
          if (p.broken <= 0) {
            p.life = 0;
            p.enabled = true;
          }
          stageMovePad(p, p.restX, p.restY);
          continue;
        }
        if (stageStanding(p)) p.life += dt;
        else if (h.type === "slag") p.life = Math.max(0, p.life - dt * 0.2);
        const limit = stageFloorLimit(h);
        if (p.life >= limit) {
          p.broken = 2800;
          p.enabled = false;
          player.onGround = false;
        } else if (h.type === "slag")
          stageMovePad(
            p,
            p.restX,
            p.restY + Math.max(0, p.life / limit - 0.65) * 90,
          );
      }
    } else if (h.type === "resonance") {
      h.pads.forEach((p, k) => {
        const u = ((h.clock + k * 180) % 5400) / 5400;
        p.enabled = u < 0.72;
        p.fade = u;
      });
    } else if (h.type === "steam") {
      for (const p of h.pads) p.enabled = h.open > 0;
    } else if (h.type === "train") {
      h.trainX = h.x - 420 + (Math.max(0, c - 0.66) / 0.19) * (h.w + 420);
      if (h.warning && !h.signal) {
        h.signal = true;
        beep(150, 0.12, "triangle", 0.025);
      }
      if (!h.warning) h.signal = false;
    }
  }
}
function stageHitBox(x, y, w, h) {
  return overlap(player, { x: x + 5, y: y + 3, w: w - 10, h: h - 6 });
}
function updateStagecraft(dt) {
  if (!level?.stagecraft || player.dead || player.isFalling) return;
  const tune = stageTuning();
  for (const h of level.stagecraft.hazards) {
    if (Math.abs(player.x - h.x) > 1600) continue;
    for (const station of [h.switch, h.relay].filter(Boolean)) {
      const inside = overlap(player, station);
      if (inside && !station.inside) activateStageSwitch(h);
      station.inside = inside;
    }
    if (
      h.type === "waterfall" &&
      h.active &&
      stageHitBox(h.x, h.y - 205, h.w, 230)
    )
      player.x += (2.2 * tune.speed * dt) / 16.67;
    if (h.type === "vine" && h.active) {
      const sx = h.x + (h.w - 76) * ((h.cycle - 0.66) / 0.19);
      h.bladeX = sx;
      if (stageHitBox(sx, h.y - 85, 76, 48))
        hurtPlayer("VINE SWEEP — DUCK", "trap");
    }
    if (h.type === "bell") {
      if (h.active && !h.fired) {
        h.fired = true;
        h.shots.push(
          { x: h.x + h.w / 2, y: h.y - 32, dir: -1, life: 1200 },
          { x: h.x + h.w / 2, y: h.y - 32, dir: 1, life: 1200 },
        );
        beep(220, 0.15, "triangle", 0.025);
      }
      if (!h.active) h.fired = false;
      for (const s of h.shots) {
        s.x += s.dir * dt * 0.2;
        s.life -= dt;
        if (stageHitBox(s.x, s.y, 34, 32))
          hurtPlayer("BELL WAVE — JUMP", "trap");
      }
      h.shots = h.shots.filter((s) => s.life > 0);
    }
    if (
      h.type === "train" &&
      h.active &&
      stageHitBox(h.trainX, h.y - 88, 420, 88)
    )
      hurtPlayer("FREIGHT TRAIN — HIGH ROUTE", "trap");
    if (h.type === "junction") {
      for (let k = 0; k < 2; k++)
        if (
          level.stagecraft.time >= (h.safeUntil || 0) &&
          k !== h.selected &&
          stageHitBox(h.x + (k * h.w) / 2, h.y - 22, h.w / 2 - 12, 24)
        )
          hurtPlayer("POWER JUNCTION", "trap");
    }
    if (h.type === "drill") {
      const count = h.columns || 3;
      for (let k = 0; k < count; k++) {
        const u =
          ((h.clock + k * 650) % (6400 * tune.warning)) / (6400 * tune.warning);
        const down =
          u < 0.64
            ? 0
            : u < 0.72
              ? (u - 0.64) / 0.08
              : u < 0.8
                ? 1
                : Math.max(0, 1 - (u - 0.8) / 0.16);
        const y = h.y - 215 + down * 180;
        if (down > 0 && stageHitBox(h.x + k * 155, y, 66, 46))
          hurtPlayer("DRILL — WAIT IN THE POCKET", "trap");
      }
    }
    if (h.type === "tide") {
      h.lavaY = h.y + 22 - Math.max(0, Math.sin(h.clock * 0.00065)) * 78;
      if (stageHitBox(h.x, h.lavaY, h.w, GROUND_Y + 100 - h.lavaY))
        hurtPlayer("LAVA TIDE — HIGH LEDGE", "trap");
    }
    if (h.type === "beam") {
      h.angle = Math.sin(h.clock * 0.00045) * 1.1;
      const receiver =
        Math.abs(-207 + Math.tan(h.angle) * (h.w - 62) + 204) < 18;
      if (receiver && !h.receiverWasHit) h.charge = 900 * tune.warning + 1000;
      h.receiverWasHit = receiver;
      h.charge = Math.max(0, h.charge - dt);
      h.warning = h.charge > 1000;
      h.active = h.charge > 0 && h.charge <= 1000;
      if (h.active && stageHitBox(h.x + h.w - 100, h.y - 25, 95, 26))
        hurtPlayer("LENS RECEIVER — JUMP", "trap");
    }
    if (h.type === "seal") updateSealEncounter(h, dt);
  }
  updateStageSpawns(dt);
}
function activateStageSwitch(h) {
  if (h.debounce > level.stagecraft.time) return;
  h.debounce = level.stagecraft.time + 450;
  if (h.type === "junction") {
    h.selected = 1 - h.selected;
    h.safeUntil = level.stagecraft.time + 900 * stageTuning().window;
  }
  if (h.type === "steam") h.open = 7500 * stageTuning().window;
  sfxBell();
}
function hitStageTarget(b) {
  if (!level?.stagecraft) return false;
  const box = {
    x: b.x - (b.size || 4),
    y: b.y - (b.size || 4),
    w: (b.size || 4) * 2,
    h: (b.size || 4) * 2,
  };
  for (const h of level.stagecraft.hazards) {
    if (h.anchor && overlap(box, h.anchor)) {
      h.disabled = 7000 * stageTuning().window;
      spawnParticles(b.x, b.y, "#b6c493", 5, 1);
      return true;
    }
    if ([h.switch, h.relay].some((s) => s && overlap(box, s))) {
      activateStageSwitch(h);
      return true;
    }
    if (h.type === "crane" && overlap(box, h.pads[0])) return true;
  }
  return false;
}
function drawStagecraft() {
  if (!level?.stagecraft) return;
  const stone = level.scene.stone,
    accent = level.scene.surface;
  ctx.save();
  if (
    level.bossArena &&
    player.x > level.bossArena.trigger - 320 &&
    level.stagecraft.hazards.some((h) => h.type === "seal" && !h.done)
  ) {
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ddd3b7";
    ctx.fillText(
      "OPEN BOTH SEALS TO ENTER",
      level.bossArena.trigger - camX,
      GROUND_Y - 195,
    );
  }
  const line = (x, y, bx, by, color = "#8f9a89", width = 3) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(bx, by);
    ctx.stroke();
  };
  const box = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#27373b";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  };
  for (const p of level.plats) {
    if (p.stageAux && p.x + p.w > camX - 100 && p.x < camX + W + 100) {
      box(p.x - camX, p.y, p.w, p.h, stone);
      ctx.fillStyle = accent;
      ctx.fillRect(p.x - camX, p.y, p.w, 5);
    }
  }
  const nearby = level.stagecraft.hazards.filter(
    (h) => Math.abs(player.x + 16 - h.x - h.w / 2) < 420,
  );
  const nearest = nearby.reduce(
    (best, h) =>
      !best ||
      Math.abs(player.x - h.x - h.w / 2) <
        Math.abs(player.x - best.x - best.w / 2)
        ? h
        : best,
    null,
  );
  for (const h of level.stagecraft.hazards) {
    const x = h.x - camX,
      y = h.y;
    if (x + h.w < -240 || x > W + 240) continue;
    const warn = h.warning ? "#dfbb7f" : "#869a8e";
    if (h.type === "tilt") {
      box(x + h.w / 2 - 20, y - 52, 40, 84, stone);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(x + h.w / 2 - 32, y - 48);
      ctx.lineTo(x + h.w / 2, y - 80);
      ctx.lineTo(x + h.w / 2 + 32, y - 48);
      ctx.fill();
    } else if (h.type === "waterfall") {
      box(x - 12, y - 218, h.w + 24, 22, stone);
      line(x - 20, y + 26, x + h.w + 20, y + 26, accent, 8);
      ctx.fillStyle = h.active
        ? "rgba(147,199,200,.7)"
        : h.warning
          ? "rgba(178,203,193,.4)"
          : "rgba(143,180,173,.12)";
      ctx.fillRect(x, y - 194, h.w, 222);
      for (let k = 9; k < h.w; k += 17)
        line(
          x + k,
          y - 180 + ((h.clock * 0.07 + k) % 70),
          x + k,
          y - 60 + ((h.clock * 0.07 + k) % 70),
          "#bad6ca",
          2,
        );
    } else if (h.type === "vine") {
      box(x - 12, y - 210, 25, 210, "#4f6550");
      box(x + h.w - 12, y - 210, 25, 210, "#4f6550");
      const end = h.active ? (h.bladeX || h.x) - camX + 38 : x + h.w / 2;
      line(
        x + h.w / 2,
        y - 202,
        end,
        y - (h.disabled > 0 ? 150 : 55),
        h.warning ? "#c4c48e" : "#849065",
        7,
      );
      box(
        h.anchor.x - camX,
        h.anchor.y,
        32,
        32,
        h.disabled > 0 ? "#687b63" : "#c2b184",
      );
      if (h.active) box(end - 38, y - 85, 76, 48, "#62734c");
    } else if (h.type === "ring") {
      const cx = x + h.w / 2,
        cy = y - 120;
      box(cx - 18, cy, 36, y - cy + 28, stone);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, 105, 0, Math.PI * 2);
      ctx.stroke();
      // Carved joints distinguish the stone wheel from its metal axle/spokes.
      for (let k = 0; k < 12; k++) {
        const a = h.angle + (k * Math.PI) / 6;
        line(
          cx + Math.cos(a) * 99,
          cy + Math.sin(a) * 99,
          cx + Math.cos(a) * 111,
          cy + Math.sin(a) * 111,
          stone,
          2,
        );
      }
      for (const p of h.pads)
        line(cx, cy, p.x - camX + p.w / 2, p.y, accent, 5);
      box(cx - 16, cy - 16, 32, 32, stone);
    } else if (h.type === "bell") {
      box(x + h.w / 2 - 90, y - 228, 20, 228, stone);
      box(x + h.w / 2 + 70, y - 228, 20, 228, stone);
      box(x + h.w / 2 - 90, y - 228, 180, 20, accent);
      ctx.save();
      ctx.translate(x + h.w / 2, y - 205);
      ctx.rotate(h.warning ? Math.sin(h.clock * 0.012) * 0.13 : 0);
      ctx.fillStyle = "#aa9363";
      ctx.beginPath();
      ctx.moveTo(-42, 0);
      ctx.lineTo(42, 0);
      ctx.lineTo(58, 102);
      ctx.lineTo(-58, 102);
      ctx.closePath();
      ctx.fill();
      box(-64, 94, 128, 14, "#d0bd89");
      box(-8, 96, 16, 27, warn);
      ctx.restore();
      for (const s of h.shots) {
        ctx.strokeStyle = "#d4c693";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(s.x - camX + 17, s.y + 16, 15, 16, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (h.type === "counterweight") {
      box(x + h.w / 2 - 14, y - 222, 28, 250, stone);
      line(x + 65, y - 215, x + h.w - 65, y - 215, accent, 8);
      for (const p of h.pads) {
        line(p.x - camX + 65, y - 215, p.x - camX + 65, p.y, "#a99e7e", 4);
        box(p.x - camX + 40, p.y + 24, 50, 38, stone);
      }
    } else if (h.type === "train") {
      line(x, y + 3, x + h.w, y + 3, "#a6ad99", 6);
      for (let k = 0; k < h.w; k += 36) box(x + k, y + 6, 18, 8, "#7f7054");
      box(x - 24, y - 175, 14, 175, "#455c60");
      box(x - 32, y - 176, 30, 62, "#293b40");
      ctx.fillStyle = h.active ? "#ce8574" : h.warning ? "#e2bc76" : "#99bf9b";
      ctx.beginPath();
      ctx.arc(x - 17, y - 149, 8, 0, Math.PI * 2);
      ctx.fill();
      // Signal ticks count down to the train, even with sound muted.
      if (h.warning) {
        const remaining = Math.ceil(((0.66 - h.cycle) / 0.23) * 3);
        for (let k = 0; k < 3; k++)
          box(
            x - 29 + k * 9,
            y - 125,
            6,
            5,
            k < remaining ? "#e2bc76" : "#526064",
          );
      }
      if (h.active)
        for (let car = 0; car < 3; car++) {
          const tx = h.trainX - camX + car * 140;
          box(tx, y - 88, 136, 74, "#667e82");
          box(tx + 12, y - 78, 32, 24, "#c8bf93");
          for (const k of [26, 112]) {
            ctx.fillStyle = "#283b41";
            ctx.beginPath();
            ctx.arc(tx + k, y - 12, 13, 0, Math.PI * 2);
            ctx.fill();
          }
        }
    } else if (h.type === "crane") {
      box(x - 20, y - 234, 24, 234, "#465e64");
      box(x + h.w - 4, y - 234, 24, 234, "#465e64");
      box(x - 20, y - 234, h.w + 40, 18, "#a1a592");
      const p = h.pads[0];
      line(
        p.x - camX + p.w / 2,
        y - 216,
        p.x - camX + p.w / 2,
        p.y,
        "#c9b87f",
        5,
      );
      box(p.x - camX + 53, p.y - 16, 50, 16, "#7a8f86");
    } else if (h.type === "junction") {
      for (let k = 0; k < 2; k++) {
        const on =
          k !== h.selected && level.stagecraft.time >= (h.safeUntil || 0);
        box(
          x + (k * h.w) / 2,
          y - 5,
          h.w / 2 - 12,
          12,
          on ? "#c4b888" : "#627e73",
        );
        if (on)
          for (let j = 12; j < h.w / 2 - 12; j += 28)
            line(
              x + (k * h.w) / 2 + j,
              y - 7,
              x + (k * h.w) / 2 + j + 8,
              y - 22,
              "#e8dfaa",
              2,
            );
      }
      line(x - 42, y - 24, x + h.w, y - 24, "#718779", 2);
    } else if (h.type === "bucket") {
      const p = h.pads[0];
      box(x + h.w / 2 - 30, y - 267, 60, 22, stone);
      line(x + h.w / 2, y - 250, p.x - camX + 18, p.y, "#aaa88e", 4);
      line(x + h.w / 2, y - 250, p.x - camX + p.w - 18, p.y, "#aaa88e", 4);
      box(p.x - camX + 8, p.y + 18, p.w - 16, 45, "#6f7c77");
    } else if (h.type === "drill") {
      box(x - 10, y - 248, h.w + 10, 20, "#7a8278");
      for (let k = 0; k < (h.columns || 3); k++) {
        const u =
            ((h.clock + k * 650) % (6400 * stageTuning().warning)) /
            (6400 * stageTuning().warning),
          down =
            u < 0.64
              ? 0
              : u < 0.72
                ? (u - 0.64) / 0.08
                : u < 0.8
                  ? 1
                  : Math.max(0, 1 - (u - 0.8) / 0.16),
          yy = y - 215 + down * 180;
        box(x + k * 155 + 22, y - 228, 20, yy - y + 240, "#6b7875");
        box(x + k * 155, yy, 66, 36, "#a1a391");
        ctx.fillStyle = "#d1cbb0";
        ctx.beginPath();
        ctx.moveTo(x + k * 155, yy + 36);
        ctx.lineTo(x + k * 155 + 33, yy + 46);
        ctx.lineTo(x + k * 155 + 66, yy + 36);
        ctx.fill();
        if (u > 0.43 && u < 0.64) {
          line(x + k * 155, y - 2, x + k * 155 + 66, y - 2, "#d7bd86", 4);
          for (let q = 0; q < 4; q++)
            box(x + k * 155 + q * 17, y - 17 - (q % 2) * 7, 4, 4, "#c7b48a");
        }
      }
    } else if (h.type === "tide") {
      box(x - 14, y - 116, 14, 160, stone);
      box(x + h.w, y - 116, 14, 160, stone);
      line(x - 14, y - 58, x + h.w + 14, y - 58, "#baaa85", 2);
      const ly = h.lavaY || y + 22;
      ctx.fillStyle = "#bb7048";
      ctx.fillRect(x, ly, h.w, Math.max(8, GROUND_Y + 80 - ly));
      line(x, ly, x + h.w, ly, "#e2b26e", 5);
    } else if (h.type === "steam") {
      line(x - 44, y + 20, x + h.w, y + 20, "#8e9f93", 9);
      for (const p of h.pads) {
        box(p.x - camX + p.w / 2 - 10, y - 6, 20, 28, "#77877a");
        if (h.open <= 0) {
          ctx.fillStyle = "rgba(184,191,166,.28)";
          ctx.fillRect(p.x - camX + p.w / 2 - 18, y - 72, 36, 68);
        }
      }
    } else if (h.type === "beam") {
      box(x + 8, y - 224, 44, 224, stone);
      box(x - 8, y - 230, 76, 40, "#829796");
      const angle = h.angle || 0,
        ex = x + 38 + Math.cos(angle) * h.w,
        ey = y - 207 + Math.sin(angle) * h.w;
      ctx.fillStyle = "rgba(225,214,163,.12)";
      ctx.beginPath();
      ctx.moveTo(x + 38, y - 207);
      ctx.lineTo(ex, ey - 30);
      ctx.lineTo(ex, ey + 30);
      ctx.fill();
      line(x + 38, y - 207, ex, ey, "#c0c5a3", 2);
      box(x + h.w - 40, y - 220, 32, 32, h.warning ? "#dcc990" : "#738983");
      line(x + h.w - 24, y - 188, x + h.w - 24, y - 25, "#8a9f94", 3);
      box(x + h.w - 100, y - 5, 95, 10, h.active ? "#dfb780" : "#7d9690");
      if (h.active)
        for (let k = 0; k < 5; k++)
          line(
            x + h.w - 94 + k * 18,
            y - 5,
            x + h.w - 90 + k * 18,
            y - 25,
            "#dfb780",
            3,
          );
    } else if (h.type === "seal") {
      const door = level.doors.find((d) => d.id === h.doorId);
      if (!door.open) {
        box(door.x - camX - 8, door.y - 18, 52, 18, "#b9b79a");
      }
    }
    for (const p of h.pads) {
      const px = p.x - camX;
      ctx.save();
      if (p.stageSlope) {
        ctx.translate(px + p.w / 2, p.y);
        ctx.rotate(p.angle);
        ctx.translate(-px - p.w / 2, -p.y);
      }
      ctx.globalAlpha = p.enabled === false ? 0.22 : 1;
      const color =
        h.type === "crystal"
          ? "#959eb3"
          : h.type === "slag" && p.life > 1200
            ? "#b18866"
            : h.type === "crane"
              ? "#687e7e"
              : stone;
      box(px, p.y, p.w, p.h, color);
      ctx.fillStyle = accent;
      ctx.fillRect(px, p.y, p.w, 5);
      if (h.type === "crane") {
        for (let k = 14; k < p.w; k += 25)
          line(px + k, p.y + 9, px + k, p.y + p.h - 8, "#91a39b", 3);
      }
      if (["tilt", "ring", "counterweight"].includes(h.type)) {
        for (let k = 35; k < p.w - 12; k += 64) {
          line(px + k, p.y + 6, px + k - 5, p.y + 12, "#354c4c", 2);
          line(px + k - 5, p.y + 12, px + k + 8, p.y + p.h - 3, "#354c4c", 2);
        }
      }
      if (["crystal", "slag"].includes(h.type) && p.life > 0) {
        const wear = Math.min(1, p.life / stageFloorLimit(h));
        ctx.strokeStyle = "#e0c69a";
        ctx.lineWidth = 2;
        for (let k = 0; k < Math.ceil(wear * 3); k++) {
          const cx = px + 15 + k * 35;
          ctx.beginPath();
          ctx.moveTo(cx, p.y + 3);
          ctx.lineTo(cx + 9, p.y + 13);
          ctx.lineTo(cx + 24, p.y + 5);
          ctx.stroke();
        }
        ctx.fillStyle = wear > 0.7 ? "#dcad78" : "#c1c8ad";
        ctx.fillRect(px + 4, p.y + p.h - 4, (p.w - 8) * (1 - wear), 2);
      }
      if (h.type === "steam" && h.open > 0) {
        const remaining = h.open / (7500 * stageTuning().window);
        ctx.fillStyle = h.open < 1800 ? "#e0b16f" : "#b5c6ae";
        for (let k = 0; k < Math.ceil(remaining * 5); k++)
          ctx.fillRect(px + 12 + k * 20, p.y + 10, 12, 5);
      }
      if (h.type === "resonance") {
        ctx.fillStyle = p.fade > 0.57 ? "#ddbd89" : "#b6c8ba";
        for (let k = 0; k < 4; k++)
          if (k < Math.ceil((1 - (p.fade || 0)) * 4))
            ctx.fillRect(px + 12 + k * 18, p.y + 10, 9, 5);
      }
      ctx.restore();
    }
    for (const s of [h.switch, h.relay].filter(Boolean)) {
      box(s.x - camX, s.y, s.w, s.h, "#4c6360");
      ctx.strokeStyle = "#d3c295";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x - camX + 16, s.y + 18, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (h === nearest) {
      const labels = {
        tilt: "WEIGHT TILTS THE STONE",
        waterfall: h.warning ? "FLOW RISING" : "WATCH THE WATER",
        vine: h.disabled ? "ANCHOR DISABLED" : "DUCK / SHOOT ANCHOR",
        ring: "BOARD LOW · RIDE UP",
        bell: h.warning ? "BELL WINDING · JUMP" : "BELL CROSSING",
        counterweight: "WEIGHT MOVES BOTH LIFTS",
        train: h.warning ? "TRAIN COMING · TAKE COVER" : "FREIGHT CROSSING",
        crane: "RIDE THE CONTAINER",
        junction: "SHOOT / TOUCH TO ROUTE POWER",
        bucket: "RIDE THE ORE BUCKET",
        drill: "DUST MEANS DANGER",
        crystal: "CRACKING · KEEP MOVING",
        tide: "HIGH WATER MARK",
        slag: "COOL → GLOW → SINK",
        steam:
          h.open > 0
            ? `BRIDGE · ${Math.ceil(h.open / 1000)}s`
            : "TURN VALVE / SHOOT",
        beam: h.warning ? "RECEIVER CHARGING" : "LENS → RECEIVER → FLOOR",
        resonance: "WATCH THE FOUR BEAT MARKS",
        seal: h.done
          ? "SEAL OPEN"
          : h.started
            ? `DEFEND SEAL · WAVE ${h.wave}`
            : "ACTIVATE SEAL",
      };
      const label = labels[h.type];
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      const tw = ctx.measureText(label).width + 12,
        tx = Math.max(tw / 2 + 12, Math.min(W - tw / 2 - 12, x + h.w / 2)),
        ty = Math.max(112, y - 260);
      ctx.fillStyle = "#263b3d";
      ctx.fillRect(tx - tw / 2, ty - 12, tw, 18);
      ctx.fillStyle = "#dcd1ad";
      ctx.fillText(label, tx, ty);
    }
  }
  ctx.restore();
}
