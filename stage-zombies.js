/* New variants share the existing zombie array, weapon hits and PNG animation bank. */
const STAGE_ZOMBIE_TYPES = [
  "rootbound",
  "windborne",
  "worker",
  "miner",
  "cinder",
  "guardian",
];
function installStageZombies(worlds) {
  const placements = [
    [
      [1420, "rootbound"],
      [3500, "rootbound"],
      [8370, "rootbound"],
      [9920, "rootbound"],
      [10280, "rootbound"],
    ],
    [
      [2270, "windborne"],
      [4570, "windborne"],
      [8220, "windborne"],
      [10600, "windborne"],
    ],
    [
      [1450, "worker"],
      [2880, "worker"],
      [4020, "worker"],
      [6920, "worker"],
      [10140, "worker"],
    ],
    [
      [420, "miner"],
      [3520, "miner"],
      [6060, "miner"],
      [8600, "miner"],
      [10550, "miner"],
    ],
    [
      [590, "cinder"],
      [3620, "cinder"],
      [4410, "cinder"],
      [6310, "cinder"],
      [8010, "cinder"],
      [10190, "cinder"],
    ],
    [
      [700, "guardian"],
      [3010, "guardian"],
      [5080, "guardian"],
      [7200, "guardian"],
    ],
  ];
  worlds.forEach((l, i) => {
    l.zombies = [];
    for (const [x, type] of placements[i]) {
      const support = l.plats
        .filter(
          (p) =>
            !p.stagecraft &&
            !p.vx &&
            !p.vy &&
            x >= p.x + 20 &&
            x + 42 <= p.x + p.w - 20,
        )
        .sort((a, b) => b.y - a.y)[0];
      if (!support) continue;
      let jumpPad =
        type === "windborne"
          ? l.plats
              .filter(
                (p) =>
                  (!p.stagecraft || p.recovery) &&
                  !p.vx &&
                  !p.vy &&
                  p.x > support.x + support.w - 5 &&
                  p.x - support.x - support.w < 160 &&
                  Math.abs(p.y - support.y) < 120,
              )
              .sort((a, b) => a.x - b.x)[0]
          : null;
      if (type === "windborne" && !jumpPad) {
        jumpPad = {
          x: Math.min(l.width - 200, x + 170),
          y: support.y - 80,
          w: 150,
          h: 22,
          oneWay: true,
          stagecraft: true,
          stageAux: true,
          enabled: true,
        };
        l.plats.push(jumpPad);
      }
      const landings = jumpPad
        ? [
            {
              x: support.x + support.w - 68,
              floor: support.y,
              lo: support.x + 12,
              hi: support.x + support.w - 54,
            },
            {
              x: jumpPad.x + 28,
              floor: jumpPad.y,
              lo: jumpPad.x + 12,
              hi: jumpPad.x + jumpPad.w - 54,
            },
          ]
        : null;
      const lo = Math.max(support.x + 12, x - 110),
        hi = Math.min(support.x + support.w - 54, x + 180);
      l.stagecraft.spawns.push({
        x,
        y: support.y - 58,
        type,
        lo,
        hi,
        floor: support.y,
        landings,
        spawned: false,
      });
      // Mixed pressure comes in a second, separated activation, not a pile at spawn.
      if (i >= 2 && hi - x > 115)
        l.stagecraft.spawns.push({
          x: x + 115,
          y: support.y - 58,
          type: i === 5 ? "worker" : "shambler",
          lo,
          hi,
          floor: support.y,
          spawned: false,
        });
    }
    for (const b of l.switches || []) if (i === 5) b.stageSeal = true;
  });
}
function resetStageEnemies(lvl, checkpoint) {
  ZombieRespawns.reset();
  if (typeof zombies !== "undefined")
    zombies = zombies.filter((z) => !z.stageVariant);
  for (const s of lvl.stagecraft.spawns)
    s.spawned = checkpoint && s.x < player.x - 500;
  lvl.stagecraft.bossWave = 0;
  lvl.stagecraft.bossAddDeadline = 0;
  lvl.stagecraft.bossBreak = 0;
  lvl.stagecraft.bossPhase = 1;
}
function makeStageZombie(s, group = null) {
  const baseHp = s.type === "guardian" ? 14 : s.type === "worker" ? 12 : 10;
  const hp = Math.round(baseHp * (state.settings.difficulty === 'easy' ? .8 : state.settings.difficulty === 'hardcore' ? 1.25 : 1));
  const z = {
    x: s.x,
    y: s.floor - 58,
    w: 40,
    h: 58,
    vx: 0,
    vy: 0,
    health: hp,
    maxHealth: hp,
    speed: 0.8,
    size: 1,
    facing: player.x < s.x ? -1 : 1,
    animT: 0,
    color: "#788b6e",
    spriteSet: s.type === "miner" ? "Zombie2" : "Zombie1",
    stageVariant: s.type,
    phase: "emerge",
    timer: 900 * stageTuning().warning,
    homeX: s.x,
    lo: s.lo,
    hi: s.hi,
    floor: s.floor,
    landingIndex: 0,
    attackCooldown: 0,
    hitFlash: 0,
    group,
    footprints: [],
    credited: false,
    spawn: s,
  };
  zombies.push(z);
  return z;
}
function stageAlive(group) {
  return zombies.filter(
    (z) => z.stageVariant && z.health > 0 && (!group || z.group === group),
  );
}
function updateStageSpawns(dt) {
  // Retire distant patrols so earlier rooms cannot consume the whole active budget.
  // Unbeaten patrols can return on a genuine backtrack; kills remain credited once.
  for(let i=zombies.length-1;i>=0;i--){
    const z=zombies[i];
    if(z.stageVariant&&!z.group&&z.health>0&&Math.abs(z.x-player.x)>1700){
      if(z.spawn)z.spawn.spawned=false;
      zombies.splice(i,1);
    }
  }
  const cap = stageTuning().cap;
  for (const s of level.stagecraft.spawns) {
    if (
      s.spawned || ZombieRespawns.waiting(s) ||
      Math.abs(player.x - s.x) > 650 ||
      Math.abs(player.x - s.x) < 150 ||
      stageAlive().length >= cap
    )
      continue;
    if (level.checkpoints.some((c) => Math.abs(c.x - s.x) < 110)) continue;
    if (
      level.wildlife.some(
        (a) =>
          ["deer", "rabbit", "lizard"].includes(a.species) &&
          Math.abs(a.homeX - s.x) < 100,
      )
    )
      continue;
    if (Math.abs(player.y + player.h - s.floor) > 230) continue;
    if (!stageSpawnSafe(s)) continue;
    s.spawned = true;
    makeStageZombie(s);
  }
  for (const z of zombies)
    if (z.stageVariant && Math.abs(z.x - player.x) > 1700) {
      z.credited = true;
      z.health = 0;
    }
  if (level.bossArena) updateStageBossReinforcements(dt);
}
function updateSealEncounter(h, dt) {
  const b = level.switches.find((b) => b.id === h.doorId),
    d = level.doors.find((d) => d.id === h.doorId);
  if (h.done) {
    d.open = true;
    return;
  }
  if (b.pressed && !h.started) {
    h.started = true;
    h.wave = 0;
    h.wait = 800;
  }
  if (!h.started) return;
  if (stageAlive(h.id).length) return;
  h.wait -= dt;
  if (h.wait > 0) return;
  const waves = state.settings.difficulty === "easy" ? 1 : 2;
  if (h.wave >= waves) {
    h.done = true;
    d.open = true;
    return;
  }
  if (stageAlive().length >= stageTuning().cap) return;
  const count = stageTuning().wave;
  let made = 0;
  for (let k = 0; k < count; k++) {
    const options = [h.x + 40 + k * 90, h.x + h.w - 90 - k * 85];
    const x = options.find(
      (x) => Math.abs(x - player.x) > 145 && stageSpawnSafe({ x, floor: h.y }),
    );
    if (x === undefined || stageAlive().length >= stageTuning().cap) continue;
    makeStageZombie(
      {
        x,
        y: h.y - 58,
        floor: h.y,
        lo: h.x + 12,
        hi: h.x + h.w - 55,
        type: k === 0 ? "guardian" : "worker",
      },
      h.id,
    );
    made++;
  }
  if (made) {
    h.wave++;
    h.wait = 1300;
  }
}
function damageStageZombie(z, b) {
  if (z.phase === "dead") return 0;
  const raw = b.damage || 1;
  const front =
    z.stageVariant === "worker" &&
    b.vx * z.facing < 0 &&
    b.y > z.y + 15 &&
    z.phase !== "recover";
  const guarded =
    z.stageVariant !== "guardian" &&
    zombies.some(
      (g) =>
        g.stageVariant === "guardian" &&
        g.phase === "channel" &&
        g.health > 0 &&
        Math.abs(g.x - z.x) < 220,
    );
  const damage = raw * (front ? 0.3 : guarded ? 0.5 : 1);
  z.hitFlash = 140;
  if (z.phase === "channel") {
    z.phase = "recover";
    z.timer = 1500;
  }
  return damage;
}
function updateStageZombie(z, dt, index) {
  dt = Math.min(dt, 40);
  const tune = stageTuning(),
    step = dt / 16.67;
  z.animT += dt;
  z.hitFlash = Math.max(0, z.hitFlash - dt);
  z.attackCooldown = Math.max(0, z.attackCooldown - dt);
  if (z.health <= 0 && z.phase !== "dead") {
    z.phase = "dead";
    if(z.spawn?.expedition)z.spawn.defeated=true;
    z.timer = 380;
    if (!z.credited) {
      z.credited = true;
      ZombieRespawns.schedule(z);
      state.zombiesKilledInLevel++;
      trackQuestProgress("zombies", 1);
      addScore(125);
      sfxZombieHit();
      spawnParticles(z.x + 20, z.y + 30, "#8c9b79", 7, 1);
    }
  }
  if (z.phase === "dead") {
    z.timer -= dt;
    if (z.timer <= 0) zombies.splice(index, 1);
    return;
  }
  if (Math.abs(z.x - player.x) > 1600) return;
  z.timer -= dt;
  const dx = player.x + player.w / 2 - z.x - z.w / 2;
  if (z.phase === "emerge") {
    if (z.timer <= 0) {
      z.phase = "idle";
      z.timer = 450;
    }
    return;
  }
  if (z.phase === "burrow") {
    z.x += (z.targetX - z.x) * (1 - Math.exp(-dt / 220));
    if (z.timer <= 0) {
      z.phase = "emerge";
      z.timer = 600 * tune.warning;
    }
    return;
  }
  if (z.phase === "idle") {
    const hidden = journeyHidden();
    if (!hidden) z.facing = dx >= 0 ? 1 : -1;
    if (!hidden && Math.abs(dx) > 28 && Math.abs(dx)<800 && Math.abs(player.y+player.h-z.floor)<180)
      moveZombieOnGround(z, z.x + z.facing * 1.5 * step);
    if (
      z.timer <= 0 &&
      !journeyHidden() &&
      Math.abs(dx) < 420 &&
      Math.abs(player.y + player.h - z.floor) < 170
    ) {
      z.phase =
        z.stageVariant === "guardian" && z.channelNext !== false
          ? "channel"
          : "windup";
      if (z.stageVariant === "guardian") z.channelNext = z.phase !== "channel";
      z.timer = z.phase === "channel" ? 1800 : 800 * tune.warning;
      z.lockDir = z.facing;
      z.startFloor = z.floor;
      z.startX = z.x;
      z.targetFloor=undefined;
      z.targetX = z.x + z.facing * Math.min(Math.abs(dx), z.stageVariant === 'windborne' ? 180 : 150);
      if(z.stageVariant==='windborne'&&!z.spawn.landings){
        const center=z.targetX+z.w/2;
        const landing=level.plats.filter(p=>p.enabled!==false&&!p.journeyRoof&&center>=p.x&&center<=p.x+p.w&&p.y>=z.floor-110&&p.y<=z.floor+160)
          .sort((a,b)=>Math.abs(a.y-z.floor)-Math.abs(b.y-z.floor))[0];
        if(landing)z.targetFloor=landing.y;
        else z.targetX=z.x;
      }
      if (z.stageVariant === "windborne" && z.spawn.landings) {
        const next = z.spawn.landings[1 - z.landingIndex];
        z.targetX = next.x;
        z.targetFloor = next.floor;
      }
    }
  } else if (z.phase === "windup") {
    if (z.timer <= 0) {
      z.phase = "attack";
      z.timer = z.stageVariant === "windborne" ? 900 : 440;
      z.duration = z.timer;
      z.hit = false;
    }
  } else if (z.phase === "attack") {
    const u = 1 - Math.max(0, z.timer) / z.duration;
    const nextX=z.startX + (z.targetX - z.startX) * u;
    if(z.stageVariant==='windborne')z.x=nextX;else moveZombieOnGround(z,nextX);
    z.y =
      z.floor -
      z.h -
      (z.stageVariant === "windborne" ? Math.sin(Math.PI * u) * 110 : 0) +
      (z.targetFloor !== undefined ? (z.targetFloor - z.floor) * u : 0);
    if (
      z.stageVariant === "cinder" &&
      z.footprints.length < 5 &&
      (!z.footprints.length || Math.abs(z.x - z.footprints.at(-1).x) > 30)
    )
      z.footprints.push({ x: z.x, y: z.floor - 8, life: 1300 });
    if (
      !z.hit &&
      overlap(player, { x: z.x + 5, y: z.y + 5, w: z.w - 10, h: z.h - 8 }) &&
      z.attackCooldown <= 0 && player.invuln<=0 && !player.dead && !player.isFalling
    ) {
      z.hit = true;
      z.attackCooldown = 1400;
      hurtPlayer("ZOMBIE CHARGE", "zombie");
      return;
    }
    if (z.timer <= 0) {
      z.phase = "recover";
      z.timer = 1250 * tune.window;
      if (z.stageVariant === "windborne" && z.spawn.landings) {
        z.landingIndex = 1 - z.landingIndex;
        const p = z.spawn.landings[z.landingIndex];
        z.floor = p.floor;
        z.lo = p.lo;
        z.hi = p.hi;
      }
      if(z.stageVariant==='windborne'&&z.targetFloor!==undefined)z.floor=z.targetFloor;
      z.y = z.floor - z.h;
    }
  } else if (z.phase === "channel") {
    if (z.timer <= 0) {
      z.phase = "recover";
      z.timer = 1500;
    }
  } else if (z.phase === "recover" && z.timer <= 0) {
    if (z.stageVariant === "miner") {
      const target = z.x + z.lockDir * 100;
      z.targetX = Math.max(z.lo, Math.min(z.hi, target));
      if (Math.abs(z.targetX - player.x) < 110) z.targetX = z.homeX;
      z.phase = "burrow";
      z.timer = 1100 * tune.warning;
    } else {
      z.phase = "idle";
      z.timer = 700;
    }
  }
  // An active enemy in direct contact must not remain harmless between lunges.
  if(['idle','channel'].includes(z.phase)&&z.attackCooldown<=0&&player.invuln<=0&&!player.dead&&!player.isFalling&&!journeyHidden()&&
      overlap(player,{x:z.x+4,y:z.y+4,w:z.w-8,h:z.h-6})){
    z.attackCooldown=1400;hurtPlayer('ZOMBIE CHARGE','zombie');return;
  }
  for (const f of z.footprints) {
    f.life -= dt;
    if (
      f.life > 0 &&
      z.attackCooldown <= 0 &&
      overlap(player, { x: f.x + 5, y: f.y, w: 20, h: 8 })
    ) {
      z.attackCooldown = 1400;
      hurtPlayer("CINDER FOOTPRINTS — JUMP", "trap");
      break;
    }
  }
  z.footprints = z.footprints.filter((f) => f.life > 0);
}
function drawStageZombie(z) {
  const x = z.x - camX;
  if (x + z.w < -100 || x > W + 100) return;
  ctx.save();
  for (const f of z.footprints) {
    ctx.fillStyle = f.life > 400 ? "#da9659" : "#846444";
    ctx.fillRect(f.x - camX, f.y, 30, 8);
  }
  if (
    z.phase === "burrow" ||
    (z.phase === "emerge" && ["rootbound", "miner"].includes(z.stageVariant))
  ) {
    ctx.fillStyle = "#b49c76";
    for (let k = 0; k < 5; k++)
      ctx.fillRect(x - 7 + k * 12, z.floor - 4 - (k % 2) * 5, 8, 5);
    ctx.strokeStyle = "#d2bc92";
    ctx.beginPath();
    ctx.moveTo(x - 16, z.floor);
    ctx.lineTo(x + 10, z.floor - 5);
    ctx.lineTo(x + 50, z.floor);
    ctx.stroke();
  }
  if (z.phase !== "burrow") {
    let action =
      z.phase === "dead"
        ? "Dead"
        : z.phase === "attack"
          ? "Attack"
          : z.phase === "idle"
            ? "Walk"
            : "Idle";
    const img = pickZombieFrame(z, action) || pickZombieFrame(z, "Walk");
    const emerge =
      z.phase === "emerge" && ["rootbound", "miner"].includes(z.stageVariant)
        ? Math.min(1, Math.max(0, 1 - z.timer / (900 * stageTuning().warning)))
        : 1;
    ctx.save();
    if (
      z.phase === "emerge" &&
      ["rootbound", "miner"].includes(z.stageVariant)
    ) {
      ctx.beginPath();
      ctx.rect(x - 45, z.floor - 95 * emerge, 130, 100);
      ctx.clip();
    }
    ctx.globalAlpha = z.phase === "dead" ? Math.max(0, z.timer / 380) : 1;
    if (z.hitFlash) ctx.globalAlpha = 0.55;
    if (img?.width) {
      const hh = 82,
        ww = (hh * img.width) / img.height;
      ctx.translate(x + 20, z.y + z.h + 4);
      ctx.scale(z.facing, 1);
      ctx.drawImage(img, -ww / 2, -hh, ww, hh);
      ctx.scale(z.facing, 1);
      ctx.translate(-x - 20, -z.y - z.h - 4);
    } else {
      ctx.fillStyle = "#789278";
      ctx.fillRect(x, z.y, z.w, z.h);
    }
    // Material silhouettes remain legible over the established character art.
    ctx.fillStyle = "#596b60";
    if (z.stageVariant === "worker") {
      ctx.fillStyle = "#b5a06a";
      ctx.fillRect(x - 2, z.y - 10, 44, 9);
      ctx.fillStyle = "#697f83";
      ctx.fillRect(x + (z.facing > 0 ? 27 : -4), z.y + 19, 17, 34);
    }
    if (z.stageVariant === "miner") {
      ctx.fillStyle = "#a19067";
      ctx.fillRect(x - 3, z.y - 9, 46, 10);
      ctx.fillStyle = "#eddfb4";
      ctx.fillRect(x + 15, z.y - 8, 10, 7);
      ctx.fillStyle = "#847966";
      ctx.fillRect(x + 40, z.y + 10, 5, 45);
      ctx.fillRect(x + 28, z.y + 12, 29, 7);
    }
    if (z.stageVariant === "rootbound") {
      ctx.strokeStyle = "#79754c";
      ctx.lineWidth = 4;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.moveTo(x + 8 + k * 11, z.y + 25);
        ctx.lineTo(x - 10 + k * 25, z.floor);
        ctx.stroke();
      }
    }
    if (z.stageVariant === "windborne") {
      ctx.fillStyle = "#c5bc95";
      ctx.beginPath();
      ctx.moveTo(x + 15, z.y + 10);
      ctx.lineTo(x - 27 * z.facing, z.y + 20);
      ctx.lineTo(x - 12 * z.facing, z.y + 33);
      ctx.fill();
    }
    if (z.stageVariant === "cinder") {
      ctx.fillStyle = "#51423c";
      ctx.fillRect(x - 5, z.y + 12, 17, 16);
      ctx.fillRect(x + 28, z.y + 12, 17, 16);
      ctx.fillStyle = "#cc9868";
      ctx.fillRect(x + 9, z.y + 30, 22, 5);
    }
    if (z.stageVariant === "guardian") {
      ctx.fillStyle = "#879c9c";
      ctx.fillRect(x + 40, z.y - 17, 5, 76);
      ctx.strokeStyle = "#b8c9bc";
      ctx.strokeRect(x + 31, z.y - 27, 23, 23);
    }
    ctx.restore();
  }
  if (z.phase === "windup" || z.phase === "channel") {
    ctx.strokeStyle = z.phase === "channel" ? "#accbbb" : "#dfba80";
    ctx.lineWidth = 2;
    if (z.stageVariant === "windborne") {
      ctx.strokeRect(z.targetX - camX, (z.targetFloor || z.floor) - 6, 40, 6);
    }
    ctx.beginPath();
    ctx.moveTo(x - 8, z.floor + 2);
    ctx.lineTo(x + 48, z.floor + 2);
    ctx.stroke();
    if (z.phase === "channel")
      for (const other of zombies)
        if (other !== z && other.health > 0 && Math.abs(other.x - z.x) < 220) {
          ctx.beginPath();
          ctx.moveTo(x + 40, z.y);
          ctx.lineTo(other.x - camX + 20, other.y + 20);
          ctx.stroke();
        }
  }
  if (z.health < z.maxHealth && z.phase !== "dead") {
    ctx.fillStyle = "#273b3d";
    ctx.fillRect(x, z.y - 20, 40, 4);
    ctx.fillStyle = "#d2ba85";
    ctx.fillRect(x, z.y - 20, (40 * z.health) / z.maxHealth, 4);
  }
  ctx.restore();
}
function updateStageBossReinforcements(dt) {
  const fb = finalBoss,
    s = level.stagecraft;
  if (fb.dead) {
    zombies = zombies.filter((z) => z.group !== "world-eater");
    return;
  }
  if (!fb.awakened) return;
  if (s.bossAddDeadline && s.time > s.bossAddDeadline) {
    for (const z of zombies)
      if (z.group === "world-eater") {
        z.health = 0;
        z.credited = true;
      }
    s.bossAddDeadline = 0;
  }
  const phase = fb.hp / fb.maxHp > 0.66 ? 1 : fb.hp / fb.maxHp > 0.33 ? 2 : 3;
  if (phase !== s.bossPhase) {
    s.bossPhase = phase;
    s.bossBreak = 2400;
    fb.pendingAttack = null;
    fb.projectiles = [];
    fb.attackTimer = 0;
  }
  s.bossBreak = Math.max(0, s.bossBreak - dt);
  if (
    phase < 2 ||
    s.bossWave >= phase - 1 ||
    fb.pendingAttack ||
    fb.projectiles.length ||
    stageAlive("world-eater").length
  )
    return;
  if (s.bossBreak > 1000 && stageAlive().length < stageTuning().cap) {
    const x =
      level.bossArena.start +
      (player.x < level.bossArena.start + 1180 ? 1780 : 530);
    makeStageZombie(
      {
        x,
        floor: GROUND_Y,
        lo: x - 80,
        hi: x + 100,
        type: phase === 2 ? "worker" : "rootbound",
      },
      "world-eater",
    );
    s.bossWave++;
    s.bossAddDeadline = s.time + 9000;
  }
}
function resetStageBossAtCheckpoint() {
  if (!level.bossArena) return;
  initFinalBoss(state.levelIndex);
  finalBoss.x = level.bossSpawnX;
  finalBoss.y = GROUND_Y - finalBoss.h;
  finalBoss.awakened = false;
  finalBoss.pendingAttack = null;
  finalBoss.projectiles = [];
  finalBoss.attackNumber = 0;
  finalBoss.attackTimer = 0;
  finalBoss.hp = finalBoss.maxHp = 1200;
  Object.assign(finalBoss, {
    name: level.bossSkin.name,
    nameGeo: level.bossSkin.nameGeo,
    color: level.bossSkin.color,
    auraColor: level.bossSkin.auraColor,
    speed: level.bossSkin.speed,
    reward: level.bossSkin.reward,
  });
}

function stageSpawnSafe(s) {
  if (!journeySpawnSafe(s)) return false;
  const body = { x: s.x, y: s.floor - 58, w: 40, h: 58 };
  if (
    level.plats.some(
      (p) =>
        p.enabled !== false &&
        !p.oneWay &&
        p.y < s.floor - 4 &&
        overlap(body, p),
    )
  )
    return false;
  if (level.spikes.some((p) => overlap(body, p))) return false;
  if (level.doors.some((d) => !d.open && overlap(body, d))) return false;
  if (
    level.obstacles.some(
      (o) => ["crate", "crawl"].includes(o.kind) && overlap(body, o),
    )
  )
    return false;
  if (
    level.encounters.some((o) => {
      if (["log", "barricade"].includes(o.type) && !o.broken)
        return overlap(body, { x: o.x, y: o.y - o.h, w: o.w, h: o.h });
      if (o.type === "windmill")
        return overlap(body, {
          x: o.x + o.w / 2 - o.radius,
          y: o.y - 82 - o.radius,
          w: o.radius * 2,
          h: o.radius * 2,
        });
      if (o.type === "electric" && o.active)
        return overlap(body, { x: o.x, y: o.y - 21, w: o.w, h: 21 });
      return false;
    })
  )
    return false;
  return !level.stagecraft.hazards.some((h) => {
    if (h.type === "junction" && level.stagecraft.time >= (h.safeUntil || 0))
      return overlap(body, {
        x: h.x + ((1 - h.selected) * h.w) / 2,
        y: h.y - 22,
        w: h.w / 2 - 12,
        h: 24,
      });
    if (h.type === "beam" && h.active)
      return overlap(body, { x: h.x + h.w - 100, y: h.y - 25, w: 95, h: 26 });
    return (
      h.active &&
      ["drill", "train", "vine", "tide"].includes(h.type) &&
      s.x + 40 > h.x &&
      s.x < h.x + h.w &&
      s.floor > h.y - 100
    );
  });
}
