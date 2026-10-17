/* Extended, authored routes for the last six worlds. Uses native player physics. */
const JOURNEY_LENGTH = 9600;
const JOURNEY_ROUTES = [
  {
    name: "THE COURIER'S MAP",
    note: "Recover the survey map",
    delivery: "Raise the aqueduct latch",
    intro:
      "The courier went beyond the temple. Follow the reeds to the buried aqueduct.",
    found:
      "The map marks a buried water conduit. Drain it and open the old floodgate.",
    zones: [
      ["grass", 300, 1450, "THE DROWNED ORCHARD"],
      ["tunnel", 2000, 2150, "ROOTS BELOW THE AQUEDUCT"],
      ["pipe", 4500, 1650, "THE BURIED WATER CONDUIT"],
      ["gauntlet", 6500, 2300, "THE BROKEN SPILLWAY"],
    ],
  },
  {
    name: "THE BELLKEEPER'S PASSAGE",
    note: "Find the bellkeeper's log",
    delivery: "Deliver the counterweight cart",
    intro:
      "The archive bridge is gone. The bellkeeper left a service route through the towers.",
    found:
      "A supply cart still runs to the far tower. Its counterweight can open the passage.",
    zones: [
      ["tunnel", 300, 1800, "INSIDE THE BELL TOWER"],
      ["grass", 2450, 1000, "THE OVERGROWN COURTYARD"],
      ["pipe", 3800, 1400, "THE TOWER CISTERN"],
      ["cart", 5600, 2500, "THE COUNTERWEIGHT RAILWAY"],
      ["gauntlet", 8400, 700, "THE LAST CAUSEWAY"],
    ],
  },
  {
    name: "THE CITY UNDER THE CITY",
    note: "Recover the maintenance badge",
    delivery: "Deliver the fuse trolley",
    intro:
      "The last train has no power. The maintenance crew used the sewers below the freight yard.",
    found:
      "The badge names Pump Nine. Restore drainage, then take the fuse trolley to the signal box.",
    zones: [
      ["grass", 200, 1100, "THE RECLAIMED FREIGHT YARD"],
      ["pipe", 1700, 2150, "SEWER NINE"],
      ["tunnel", 4200, 1650, "THE SERVICE UNDERPASS"],
      ["cart", 6200, 2500, "THE FUSE TROLLEY"],
    ],
  },
  {
    name: "THE MINERS' LAST SHIFT",
    note: "Find the miners' field book",
    delivery: "Deliver the ore battery",
    intro:
      "The miners sealed the lower shaft. Their field book points to a working ore railway.",
    found:
      "The ore battery powers the exit hoist. Ride it through the shaft, then drain the escape pipe.",
    zones: [
      ["tunnel", 300, 2000, "THE LOWER SHAFT"],
      ["grass", 2600, 900, "THE FUNGUS GARDEN"],
      ["cart", 3900, 2500, "THE ORE EXPRESS"],
      ["pipe", 6800, 1900, "THE FLOODED ESCAPE PIPE"],
    ],
  },
  {
    name: "THE FORGE RUN",
    note: "Find the forge order",
    delivery: "Deliver the shield cart",
    intro:
      "The lighthouse lens needs a heat shield. The abandoned forge still has one on its tram.",
    found:
      "Vent the pressure line before crossing. The shield must reach the basalt door intact.",
    zones: [
      ["grass", 200, 1000, "THE ASH REEDS"],
      ["pipe", 1550, 1600, "THE PRESSURE MAIN"],
      ["tunnel", 3550, 1700, "INSIDE THE OLD FORGE"],
      ["cart", 5650, 2300, "THE SHIELD TRAM"],
      ["gauntlet", 8200, 800, "THE COOLING BEDS"],
    ],
  },
  {
    name: "THE KEEPER'S LAST LIGHT",
    note: "Recover the keeper's journal",
    delivery: "Restore the beacon relay",
    intro:
      "The two seals are open, but the beacon is dark. Follow the keeper's route beneath the lighthouse.",
    found:
      "Clear the sea intake and reach the beacon relay. The World Eater waits beyond the service gate.",
    zones: [
      ["grass", 200, 1200, "THE SALT MARSH"],
      ["pipe", 1800, 1700, "THE SEA INTAKE"],
      ["tunnel", 3900, 1900, "BENEATH THE LIGHTHOUSE"],
      ["gauntlet", 6200, 2600, "THE KEEPER'S FINAL WALK"],
    ],
  },
];

function installJourneys(worlds) {
  const G = GROUND_Y;
  worlds.forEach((l, i) => {
    const start = i === 5 ? 7480 : l.width - 360;
    const originalWidth = l.width;
    if (i === 5) {
      // Insert before the arena. Preserve shared object references while moving
      // the arena floor, checkpoint, chest, boss and finish together.
      const seen = new Set();
      const xKeys = new Set([
        "x",
        "homeX",
        "restX",
        "minX",
        "maxX",
        "to",
        "lo",
        "hi",
        "rewardX",
        "bossSpawnX",
        "start",
        "end",
        "trigger",
      ]);
      const shift = (o) => {
        if (!o || typeof o !== "object" || seen.has(o)) return;
        seen.add(o);
        for (const [k, v] of Object.entries(o)) {
          if (typeof v === "number" && xKeys.has(k) && v >= start)
            o[k] += JOURNEY_LENGTH;
          else if (v && typeof v === "object") shift(v);
        }
      };
      shift(l);
      l.sections.find((s) => s.title === "THE WORLD EATER").x += JOURNEY_LENGTH;
    } else l.flag.x += JOURNEY_LENGTH;
    l.width = originalWidth + JOURNEY_LENGTH;
    const plan = JOURNEY_ROUTES[i];
    const j = (l.journey = {
      start,
      originalWidth,
      originalCheckpoints: l.checkpoints.length,
      plan,
      world: i,
      zones: [],
      hazards: [],
      goals: [false, false, false],
      clock: 0,
      riding: null,
      message: "",
      messageTime: 0,
    });
    const floor = (x, w, rise = 0) => {
      const p = { x, y: G - rise, w, h: rise ? 40 : 150, journeyTerrain: true };
      l.plats.push(p);
      return p;
    };
    const roof = (x, w, clearance) =>
      l.plats.push({ x, y: G - clearance - 30, w, h: 30, journeyRoof: true });
    const hazard = (type, x, extra = {}) =>
      j.hazards.push({
        type,
        x,
        y: G,
        w: 70,
        period: 3800,
        clock: 0,
        ...extra,
      });
    const log = (x, w = 100) =>
      l.encounters.push({
        type: "log",
        x,
        y: G,
        w,
        h: 44,
        period: 4200,
        clock: 0,
      });
    const crawl = (x, w = 150) =>
      l.obstacles.push({
        kind: "crawl",
        x,
        y: G - 118,
        w,
        h: 82,
        journey: true,
      });
    const checkpoint = (x) => {
      if (!l.checkpoints.some((c) => Math.abs(c.x - x) < 150))
        l.checkpoints.push({ x, y: G, active: false });
    };
    let cursor = start;
    for (const [type, offset, w, title] of plan.zones) {
      const x = start + offset;
      const z = {
        type,
        x,
        w,
        title,
        visited: false,
        open: 0,
        debounce: 0,
        inside: false,
      };
      j.zones.push(z);
      l.sections.push({ x: x - 120, title });
      checkpoint(x - 140);
      if (type === "gauntlet") {
        floor(cursor, x - cursor);
        for (let k = 0, xx = x; xx < x + w; k++, xx += 245) {
          const rise = [0, 50, 100, 50][k % 4];
          const p = floor(xx, Math.min(180, x + w - xx), rise);
          if (p.w > 120) {
            l.coins.push({
              x: xx + 70,
              y: p.y - 48,
              w: 22,
              h: 22,
              taken: false,
            });
            if (k % 3 === 1)
              hazard("vent", xx + 90, {
                y: p.y,
                w: 45,
                period: 3600 + (k % 2) * 500,
              });
          }
        }
        cursor = x + w;
      }
      if (type === "grass") {
        z.color = [
          "#6d8b51",
          "#83977a",
          "#6b8063",
          "#85856d",
          "#99856b",
          "#77968a",
        ][i];
        for (let at = 260; at < w - 300; at += 410) log(x + at, 95);
        z.note = { x: x + w - 160, y: G - 40, w: 32, h: 40, held: 0 };
      }
      if (type === "tunnel") {
        roof(x, w, 190);
        for (let k = 0, at = 240; at < w - 160; k++, at += 430) {
          if (k % 3 === 0) crawl(x + at);
          else if (k % 3 === 1) log(x + at, 105);
          else hazard("press", x + at, { w: 74, period: 4400 });
        }
        z.crate = { x: x + w - 160, y: G - 36, w: 34, h: 36 };
        l.coinBags.push({ ...z.crate, taken: false });
      }
      if (type === "pipe") {
        roof(x, w, 112);
        z.duration = Math.max(9500, (w / 4.8) * 16.67 + 4500);
        z.valves = [x - 65, x + w * 0.5, x + w - 90].map((vx, k) => ({
          x: vx,
          y: G - 52,
          w: 34,
          h: 48,
          terminal: k === 2,
          inside: false,
        }));
        for (let k = 0, at = 260; at < w - 180; k++, at += 350) {
          l.plats.push({
            x: x + at,
            y: G - 42,
            w: 125,
            h: 18,
            oneWay: true,
            journeyTerrain: true,
          });
          if (k % 2 === 0)
            hazard("vent", x + at + 175, { w: 42, period: 4000, pipe: z });
        }
      }
      if (type === "cart") {
        z.pad = {
          x: x + 30,
          y: G - 22,
          w: 100,
          h: 22,
          oneWay: true,
          stagecraft: true,
          enabled: true,
          journeyCart: true,
        };
        l.plats.push(z.pad);
        z.end = x + w - 130;
        for (let k = 0, at = 420; at < w - 240; k++, at += 480)
          hazard(k % 2 ? "railBeam" : "railDebris", x + at, {
            w: k % 2 ? 120 : 65,
            cart: z,
          });
        checkpoint(x + w + 140);
      }
      // Ground encounters stay outside the cart lane and between recovery areas.
      if (["grass", "tunnel"].includes(type)) {
        for (const at of [w * 0.35, w * 0.78]) {
          const sx = x + at;
          l.stagecraft.spawns.push({
            x: sx,
            y: G - 58,
            floor: G,
            type:
              type === "tunnel"
                ? "miner"
                : [
                    "rootbound",
                    "shambler",
                    "worker",
                    "miner",
                    "cinder",
                    "guardian",
                  ][i],
            lo: sx - 85,
            hi: sx + 100,
            spawned: false,
          });
        }
      }
      for (let at = 120; at < w - 100; at += 240)
        if (type !== "gauntlet")
          l.coins.push({
            x: x + at,
            y: G - (type === "cart" ? 100 : 70),
            w: 22,
            h: 22,
            taken: false,
          });
    }
    floor(cursor, start + JOURNEY_LENGTH - cursor + (i === 5 ? 0 : 360));
    j.relay = { x: start + 9150, y: G - 52, w: 36, h: 52 };
    j.gate = {
      id: "journey-exit",
      x: start + 9410,
      y: G - 255,
      w: 42,
      h: 255,
      open: false,
    };
    l.doors.push(j.gate);
    checkpoint(start + 9010);
    for (const z of j.zones.filter((z) => ["tunnel", "cart"].includes(z.type)))
      l.supplyCaches.push({
        x: z.x - 100,
        y: G - 38,
        w: 40,
        h: 38,
        taken: false,
      });
    l.checkpoints.sort((a, b) => a.x - b.x);
    l.sections.sort((a, b) => a.x - b.x);
  });
}

function journeyExitReady() {
  return !level?.journey || level.journey.goals.every(Boolean);
}
function journeyDuckHeld() {
  return !!(
    keys.ArrowDown ||
    keys.KeyS ||
    keys.ControlLeft ||
    keys.ControlRight ||
    touchDuckState
  );
}
function journeyGrass() {
  return level?.journey?.zones.find(
    (z) =>
      z.type === "grass" &&
      player.x + player.w > z.x &&
      player.x < z.x + z.w &&
      player.y + player.h > GROUND_Y - 20,
  );
}
function journeyMoveScale() {
  return journeyGrass() ? (journeyDuckHeld() ? 0.58 : 0.76) : 1;
}
function journeyHidden() {
  return !!journeyGrass() && player.isDucking && !isFireHeld();
}
function journeyMessage(text, duration = 5500) {
  if (!level?.journey) return;
  level.journey.message = GameGeorgian.translate(text);
  level.journey.messageTime = duration;
}
function resetJourney(l, checkpoint = false) {
  const j = l?.journey;
  if (!j) return;
  j.clock = 0;
  j.riding = null;
  j.messageTime = 0;
  if (!checkpoint) {
    j.goals = [false, false, false];
    j.introduced = false;
  }
  for (const h of j.hazards) {
    h.clock = 0;
    h.warning = h.active = false;
  }
  for (const z of j.zones) {
    z.open = 0;
    z.debounce = 0;
    if (!checkpoint) z.visited = false;
    if (z.note) z.note.held = 0;
    for (const v of z.valves || []) v.inside = false;
    if (z.pad) {
      z.pad.x = z.x + 30;
      z.pad.y = GROUND_Y - 22;
      z.pad.enabled = true;
    }
  }
  if(j.distinct) for(const n of j.nodes){n.held=0;n.done=j.goals[n.index];if(n.defender)n.defender.defeated=!!j.goals[n.index];}
  j.gate.open = j.goals.every(Boolean);
}
function prepareJourney(dt) {
  const j = level?.journey;
  if (!j || player.dead || player.isFalling) return;
  dt = Math.min(33, Math.max(0, dt));
  j.clock += dt;
  j.messageTime = Math.max(0, j.messageTime - dt);
  for (const z of j.zones) {
    z.open = Math.max(0, z.open - dt);
    if (z.type !== "cart") continue;
    const p = z.pad;
    if (
      !j.riding &&
      p.x < z.end - 1 &&
      journeyDuckHeld() &&
      Math.abs(player.x - p.x) < 95 &&
      Math.abs(player.y + player.h - GROUND_Y) < 70
    ) {
      j.riding = z;
      player.x = p.x + 34;
      player.y = p.y - player.h;
      player.onGround = true;
      journeyMessage(
        "CART: SPACE to jump debris · DOWN to duck · LEFT to brake",
        6500,
      );
    }
    if (j.riding !== z) continue;
    player.vx = 0;
    player.dashTimer = 0;
    player.slipping = 0;
    player.facing = 1;
    const brake = keys.ArrowLeft || keys.KeyA;
    const speed =
      (state.settings.difficulty === "easy"
        ? 5
        : state.settings.difficulty === "hardcore"
          ? 6.2
          : 5.7) * (brake ? 0.52 : 1);
    const dx = Math.min(z.end - p.x, (speed * dt) / 16.67);
    p.x += dx;
    // Keep horizontal momentum while the rider jumps using the native gravity.
    player.x += dx;
    if (p.x >= z.end) {
      j.riding = null;
      j.goals[2] = true;
      player.x = z.x + z.w + 95;
      player.y = GROUND_Y - player.h;
      player.vx = player.vy = 0;
      player.onGround = true;
      journeyMessage("DELIVERY COMPLETE · The service gate has power.");
      sfxBell();
    }
  }
}
function activateJourneyValve(z, v) {
  const j = level.journey;
  if (z.debounce > j.clock) return;
  z.debounce = j.clock + 450;
  z.open = z.duration * stageTuning().window;
  if (v.terminal) j.goals[1] = true;
  sfxBell();
  journeyMessage(
    v.terminal
      ? "PUMP RESTORED · The lower passage is clear."
      : "PUMP RUNNING · Reach the next valve before the water returns.",
    3200,
  );
}
function hitJourneyTarget(b) {
  const j = level?.journey;
  if (!j) return false;
  if(j.distinct)return hitDistinctJourney(b);
  const box = {
    x: b.x - (b.size || 4),
    y: b.y - (b.size || 4),
    w: (b.size || 4) * 2,
    h: (b.size || 4) * 2,
  };
  for (const z of j.zones)
    for (const v of z.valves || [])
      if (overlap(box, v)) {
        activateJourneyValve(z, v);
        return true;
      }
  if (!j.zones.some((z) => z.type === "cart") && overlap(box, j.relay)) {
    j.goals[2] = true;
    sfxBell();
    return true;
  }
  return false;
}
function updateJourney(dt) {
  const j = level?.journey;
  if (!j || player.dead || player.isFalling) return;
  if(j.distinct){updateDistinctJourney(dt);return;}
  const serial = level.stagecraft.resetSerial;
  dt = Math.min(33, Math.max(0, dt));
  if (!j.introduced && player.x > j.start - 180) {
    j.introduced = true;
    journeyMessage(j.plan.intro, 8500);
  }
  for (const z of j.zones) {
    if (player.x > z.x && player.x < z.x + z.w && !z.visited) {
      z.visited = true;
      if (z.type === "grass")
        journeyMessage(
          "DEEP GRASS · Crouch to hide. Watch for roots beneath the stalks.",
          4500,
        );
    }
    if (z.note && !j.goals[0]) {
      const near = Math.abs(player.x - z.note.x) < 65 && player.onGround;
      z.note.held = near && journeyDuckHeld() ? z.note.held + dt : 0;
      if (z.note.held > 600) {
        j.goals[0] = true;
        journeyMessage(j.plan.found, 8500);
        sfxBell();
      }
    }
    for (const v of z.valves || []) {
      const inside = overlap(player, v);
      if (inside && !v.inside) activateJourneyValve(z, v);
      v.inside = inside;
    }
    if (
      z.type === "pipe" &&
      z.open <= 0 &&
      overlap(player, { x: z.x + 90, y: GROUND_Y - 25, w: z.w - 160, h: 25 })
    ) {
      hurtPlayer("FLOODED PIPE — OPERATE THE PUMP", "trap");
      if (level.stagecraft.resetSerial !== serial) return;
    }
  }
  if (!j.zones.some((z) => z.type === "cart") && overlap(player, j.relay))
    j.goals[2] = true;
  j.gate.open = j.goals.every(Boolean);
  for (const h of j.hazards) {
    if (Math.abs(player.x - h.x) > 1400) continue;
    h.clock += dt * stageTuning().speed;
    const c =
      (h.clock % (h.period * stageTuning().warning)) /
      (h.period * stageTuning().warning);
    h.warning = c >= 0.38 && c < 0.66;
    h.active = c >= 0.66 && c < 0.84;
    let box;
    if (h.type === "press") {
      const down =
        c < 0.66
          ? 0
          : c < 0.73
            ? (c - 0.66) / 0.07
            : c < 0.84
              ? 1
              : Math.max(0, 1 - (c - 0.84) / 0.14);
      h.headY = h.y - 160 + down * 118;
      if (down > 0) box = { x: h.x + 5, y: h.headY, w: h.w - 10, h: 44 };
    } else if (h.type === "vent" && h.active && (!h.pipe || h.pipe.open > 0))
      box = { x: h.x + 5, y: h.y - 45, w: h.w - 10, h: 45 };
    else if (h.type === "railDebris")
      box = { x: h.x + 5, y: h.y - 44, w: h.w - 10, h: 44 };
    else if (h.type === "railBeam")
      box = { x: h.x + 4, y: h.y - 140, w: h.w - 8, h: 90 };
    if (box && overlap(player, box)) {
      hurtPlayer(
        h.type === "railBeam"
          ? "LOW BEAM — DUCK"
          : h.type === "railDebris"
            ? "TRACK DEBRIS — JUMP"
            : "SERVICE MACHINERY — WAIT FOR THE SIGNAL",
        "trap",
      );
      if (level.stagecraft.resetSerial !== serial) return;
    }
  }
}

function journeySpawnSafe(s) {
  const j = level?.journey;
  if (!j) return true;
  return (
    !j.hazards.some((h) => Math.abs(h.x - s.x) < 100) &&
    !j.zones.some(
      (z) => ["cart", "pipe"].includes(z.type) && s.x > z.x && s.x < z.x + z.w,
    )
  );
}

function drawJourneyBackdrops() {
  const j = level?.journey;
  if (!j) return;
  if(j.distinct){drawDistinctJourneyBackdrop();return;}
  const G = GROUND_Y;
  ctx.save();
  for (const z of j.zones) {
    const x = z.x - camX;
    if (x + z.w < -80 || x > W + 80 || !["tunnel", "pipe"].includes(z.type))
      continue;
    const pipe = z.type === "pipe",
      top = G - (pipe ? 142 : 220);
    const left = Math.max(-35, x),
      right = Math.min(W + 35, x + z.w);
    ctx.fillStyle = pipe ? "#1c3032" : "#24292a";
    ctx.fillRect(left, top, right - left, G - top);
    ctx.fillStyle = level.scene.stone;
    ctx.fillRect(left, top - 20, right - left, 50);
    const first = Math.max(0, Math.floor((camX - z.x) / 100));
    for (let k = first; k * 100 < z.w && x + k * 100 < W + 100; k++) {
      const xx = x + k * 100;
      ctx.strokeStyle = pipe ? "#5f7371" : "#444d48";
      ctx.lineWidth = pipe ? 5 : 2;
      ctx.beginPath();
      ctx.moveTo(xx, top + 30);
      ctx.lineTo(xx, G);
      ctx.stroke();
      if (!pipe) {
        ctx.strokeStyle = "#59604e";
        ctx.lineWidth = 8;
        if (k % 4 === 0) {
          ctx.beginPath();
          ctx.moveTo(xx, G);
          ctx.lineTo(xx + 18, top + 36);
          ctx.lineTo(xx + 85, top + 36);
          ctx.stroke();
        }
        ctx.strokeStyle = "#343e39";
        ctx.lineWidth = 1;
        for (let row = 0; row < 3; row++) {
          ctx.beginPath();
          ctx.moveTo(xx, top + 65 + row * 45);
          ctx.lineTo(xx + 100, top + 65 + row * 45);
          ctx.stroke();
        }
      }
      if (k % 3 === 1) {
        ctx.fillStyle = "rgba(217,181,108,.09)";
        ctx.beginPath();
        ctx.moveTo(xx + 30, top + 40);
        ctx.lineTo(xx - 35, G);
        ctx.lineTo(xx + 100, G);
        ctx.fill();
        ctx.fillStyle = "#ceb57a";
        ctx.fillRect(xx + 23, top + 36, 14, 13);
      }
    }
    ctx.strokeStyle = pipe ? "#88968b" : "#7f7e65";
    ctx.lineWidth = 12;
    for (const edge of [x, x + z.w]) {
      if (edge < -80 || edge > W + 80) continue;
      ctx.beginPath();
      ctx.moveTo(edge, G);
      ctx.lineTo(edge, top + 45);
      ctx.quadraticCurveTo(edge + 18, top + 12, edge + 50, top + 30);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawJourneyObjects() {
  const j = level?.journey;
  if (!j) return;
  if(j.distinct){drawDistinctJourneyObjects();return;}
  const G = GROUND_Y;
  ctx.save();
  const box = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#263739";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  };
  for (const z of j.zones) {
    const x = z.x - camX;
    if (x + z.w < -140 || x > W + 140) continue;
    if (z.type === "pipe") {
      const draining = z.open > 0;
      ctx.fillStyle = draining
        ? "rgba(91,132,121,.35)"
        : "rgba(100,147,130,.65)";
      ctx.fillRect(
        Math.max(-20, x + 90),
        G - (draining ? 4 : 25),
        Math.max(0, Math.min(W + 20, x + z.w - 70) - Math.max(-20, x + 90)),
        draining ? 4 : 25,
      );
      for (const v of z.valves) {
        const vx = v.x - camX;
        box(vx + 12, v.y + 15, 10, 40, "#71877c");
        ctx.strokeStyle = draining ? "#b5c6a5" : "#d3af7f";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(vx + 17, v.y + 17, 16, 0, Math.PI * 2);
        ctx.moveTo(vx + 1, v.y + 17);
        ctx.lineTo(vx + 33, v.y + 17);
        ctx.moveTo(vx + 17, v.y + 1);
        ctx.lineTo(vx + 17, v.y + 33);
        ctx.stroke();
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#d5d5b6";
        ctx.fillText(
          draining ? `${Math.ceil(z.open / 1000)}s` : "PUMP",
          vx + 17,
          v.y - 8,
        );
      }
    }
    if (z.type === "cart") {
      ctx.strokeStyle = "#9a9f8d";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(Math.max(-20, x), G - 4);
      ctx.lineTo(Math.min(W + 20, x + z.w), G - 4);
      ctx.stroke();
      for (
        let k = Math.max(0, Math.floor((camX - z.x) / 45));
        k * 45 < z.w && x + k * 45 < W + 30;
        k++
      )
        box(x + k * 45, G, 26, 8, "#7c6d52");
      const cx = z.pad.x - camX;
      box(cx, z.pad.y, 100, 20, "#7a8580");
      box(cx + 9, z.pad.y + 2, 82, 12, "#a49b7c");
      for (const wheel of [18, 82]) {
        ctx.fillStyle = "#27383b";
        ctx.beginPath();
        ctx.arc(cx + wheel, G - 3, 11, 0, Math.PI * 2);
        ctx.fill();
      }
      box(cx + 64, z.pad.y - 25, 25, 25, "#8d8066");
      if (!j.goals[2] && Math.abs(player.x - z.pad.x) < 180 && !j.riding) {
        ctx.fillStyle = "#e0c990";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("DOWN · BOARD CART", cx + 50, G - 85);
      }
    }
    if (z.note && !j.goals[0]) {
      const nx = z.note.x - camX;
      box(nx, z.note.y, 32, 40, "#a89773");
      box(nx + 6, z.note.y + 6, 20, 22, "#d6cb9f");
      if (Math.abs(player.x - z.note.x) < 140) {
        ctx.fillStyle = "#e0d5b2";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HOLD DOWN · READ", nx + 16, G - 64);
        ctx.fillRect(nx, G - 54, 32 * Math.min(1, z.note.held / 600), 3);
      }
    }
  }
  for (const h of j.hazards) {
    const x = h.x - camX,
      y = h.y;
    if (x + h.w < -80 || x > W + 80) continue;
    if (h.type === "press") {
      box(x + 26, y - 190, 22, (h.headY || y - 160) - (y - 190), "#6d7e79");
      box(x, h.headY || y - 160, h.w, 44, "#a2997c");
      if (h.warning) box(x, y - 5, h.w, 5, "#d8b477");
    } else if (h.type === "vent") {
      box(x, y - 5, h.w, 9, "#687a70");
      if (h.active && (!h.pipe || h.pipe.open > 0)) {
        ctx.fillStyle = "rgba(198,193,143,.8)";
        for (let k = 0; k < 4; k++)
          ctx.fillRect(
            x + 5 + k * 9,
            y - 45 + (k % 2) * 7,
            6,
            45 - (k % 2) * 7,
          );
      } else if (h.warning) {
        ctx.fillStyle = "#d7b580";
        ctx.fillRect(x + 8, y - 10, h.w - 16, 5);
      }
    } else if (h.type === "railBeam") {
      box(x, y - 190, 12, 140, "#615f4d");
      box(x, y - 140, h.w, 90, "#82785c");
      ctx.fillStyle = "#e4ce8c";
      ctx.font = "12px sans-serif";
      ctx.fillText("DUCK", x + 20, y - 108);
    } else {
      box(x, y - 44, h.w, 44, "#8c7860");
      ctx.strokeStyle = "#c1b18b";
      ctx.beginPath();
      ctx.moveTo(x + 8, y - 38);
      ctx.lineTo(x + h.w - 8, y - 6);
      ctx.stroke();
      ctx.fillStyle = "#ddc98d";
      ctx.font = "12px sans-serif";
      ctx.fillText("JUMP", x, y - 58);
    }
  }
  if (!j.zones.some((z) => z.type === "cart")) {
    const x = j.relay.x - camX;
    box(x, j.relay.y, 36, 52, "#637975");
    box(x + 9, j.relay.y + 9, 18, 18, j.goals[2] ? "#abc39d" : "#beab7e");
  }
  if (Math.abs(player.x - j.gate.x) < 400) {
    const x = Math.max(160, Math.min(W - 160, j.gate.x - camX));
    ctx.fillStyle = "#ded3ad";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    const tasks = [
      j.plan.note,
      "Restore the pipe's exit pump",
      j.plan.delivery,
    ];
    ctx.fillText(
      j.goals.every(Boolean)
        ? "SERVICE ROUTE OPEN"
        : tasks[j.goals.findIndex((g) => !g)],
      x,
      G - 285,
    );
  }
  ctx.restore();
}

function drawJourneyForeground() {
  const j = level?.journey;
  if (!j) return;
  ctx.save();
  for (const z of j.zones) {
    if (z.type !== "grass" || z.x + z.w < camX || z.x > camX + W) continue;
    const first = Math.max(0, Math.floor((camX - z.x) / 18));
    for (let k = first; k * 18 < z.w && z.x + k * 18 < camX + W + 20; k++) {
      const wx = z.x + k * 18,
        x = wx - camX,
        h = 46 + ((k * 17) % 43),
        bend = Math.sin(j.clock * 0.0018 + k) * 5;
      ctx.globalAlpha = Math.abs(wx - player.x) < 65 ? 0.3 : 0.85;
      ctx.strokeStyle = z.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y);
      ctx.quadraticCurveTo(x + 5, GROUND_Y - h * 0.5, x + bend, GROUND_Y - h);
      ctx.moveTo(x + 2, GROUND_Y - 20);
      ctx.lineTo(x + 13 + bend, GROUND_Y - h * 0.7);
      ctx.stroke();
      if (j.world === 3 && k % 3 === 0) {
        ctx.fillStyle = "#ad9a88";
        ctx.beginPath();
        ctx.ellipse(x + bend, GROUND_Y - h, 10, 5, 0, Math.PI, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}
function drawJourneyStory() {
  const j = level?.journey;
  if (!j || player.x < j.start - 300) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#d7d0ad";
  ctx.fillText(
    `${j.plan.name} · ${j.goals.filter(Boolean).length}/3`,
    W / 2,
    91,
  );
  if (j.messageTime > 0) {
    ctx.font = "12px sans-serif";
    const words = j.message.split(" "),
      lines = [];
    let line = "";
    for (const word of words) {
      if (ctx.measureText(line + word).width > 620) {
        lines.push(line.trim());
        line = "";
      }
      line += word + " ";
    }
    if (line) lines.push(line.trim());
    ctx.fillStyle = "rgba(20,32,32,.9)";
    ctx.fillRect(W / 2 - 330, H - 126, 660, lines.length * 18 + 18);
    ctx.fillStyle = "#ddd5b8";
    lines.forEach((text, k) => ctx.fillText(text, W / 2, H - 108 + k * 18));
  }
  ctx.restore();
}
