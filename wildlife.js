/* Small, local state machines: no path searches or spawning in the frame loop. */
function installAdventureWildlife(worlds) {
  const [jungle, sky, neon, cave, volcano, finale] = worlds;
  const animal = (lvl, species, x, rise = 0, range = 90) => {
    const a = { species, homeX: x, homeY: GROUND_Y - rise, range };
    // Deliveries land on a permanent platform, never in a pit or on a lift.
    const platforms = lvl.plats.filter(
      (p) =>
        !p.vx &&
        !p.vy &&
        !p.adventureBridge &&
        p.y > a.homeY + 25 &&
        x >= p.x - 36 &&
        x <= p.x + p.w + 36,
    );
    const perch = platforms.sort((a, b) => a.y - b.y)[0];
    a.rewardX =
      species === "bird" && perch
        ? Math.max(perch.x + 24, Math.min(perch.x + perch.w - 24, x))
        : x + range * 0.7;
    a.rewardY = species === "bird" && perch ? perch.y : GROUND_Y;
    if (species === "lizard") {
      const traps = [
        ...lvl.encounters.filter((o) =>
          ["fan", "electric", "sluice"].includes(o.type),
        ),
        ...lvl.obstacles.filter((o) =>
          ["dart", "pulse", "teeth", "press"].includes(o.kind),
        ),
      ];
      a.trap = traps.sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
    }
    lvl.wildlife.push(a);
  };
  animal(jungle, "deer", 3310, 0, 100);
  animal(jungle, "rabbit", 7660, 0, 95);
  animal(jungle, "bird", 1930, 260, 150);
  animal(sky, "bird", 1110, 260, 130);
  animal(sky, "bird", 7850, 320, 120);
  animal(neon, "bird", 4070, 330, 100);
  animal(neon, "rabbit", 11360, 0, 85);
  // Swoops belong over broad floors, away from the falling-rock corridor.
  animal(cave, "bat", 5860, 280, 110);
  animal(cave, "bat", 9880, 310, 110);
  animal(cave, "lizard", 9580, 0, 100);
  animal(volcano, "lizard", 7750, 0, 85);
  animal(volcano, "bird", 4310, 320, 100);
  animal(finale, "bird", 2070, 340, 110);
  animal(finale, "rabbit", 7620, 0, 85);
  // A quiet pocket gives the player time to notice the lizard's valve.
  cave.zombies = cave.zombies.filter((z) => Math.abs(z.x - 9580) > 100);
}

function resetAdventureWildlife(lvl) {
  for (const a of lvl.wildlife || []) {
    Object.assign(a, {
      x: a.homeX,
      y: a.homeY,
      vx: 0,
      facing: 1,
      phase: "idle",
      timer: 600 + (a.homeX % 500),
      targetX: a.homeX,
      anim: 0,
      flightTime: 0,
      calm: 0,
      helped: false,
      pickup: null,
      hit: false,
      cooldown: 0,
      message: "",
      messageTime: 0,
    });
  }
}

function moveWildlife(a, target, speed, dt) {
  const dx = target - a.x;
  const desired = Math.max(-speed, Math.min(speed, dx * 5));
  const oldVx = a.vx;
  a.vx += (desired - a.vx) * (1 - Math.exp(-dt / 110));
  const distance = ((oldVx + a.vx) * 0.5 * dt) / 1000;
  if (Math.abs(dx) < 0.6 && Math.abs(a.vx) < 7) {
    a.x = target;
    a.vx = 0;
  } else a.x += distance;
  // Dead zones stop tiny corrections from flipping the sprite every frame.
  if (Math.abs(a.vx) > 9 && Math.abs(dx) > 4) a.facing = a.vx > 0 ? 1 : -1;
  a.anim += Math.abs(distance) * 0.12;
}

function wildlifeMessage(a, text) {
  a.message = text;
  a.messageTime = 2600;
}

function dropWildlifeCoins(a, count, fromY = a.rewardY - 20) {
  if (a.helped) return;
  a.helped = true;
  a.pickup = {
    x: a.rewardX - 10,
    y: fromY,
    w: 20,
    h: 20,
    floorY: a.rewardY - 20,
    count,
    taken: false,
  };
}

function updateWildlifePickup(a, dt) {
  const p = a.pickup;
  if (!p || p.taken) return;
  p.y = Math.min(p.floorY, p.y + (180 * dt) / 1000);
  if (p.y !== p.floorY || !overlap(player, p)) return;
  p.taken = true;
  state.coinsCollected = (state.coinsCollected || 0) + p.count;
  trackQuestProgress("coins", p.count);
  addScore(p.count * 10);
  sfxCoin();
  checkAchievements();
  saveData();
  wildlifeMessage(a, `+${p.count} COINS`);
}

function updateAdventureWildlife(elapsed) {
  if (!level.endgameDesign || player.dead || player.isFalling) return;
  // Resume after a stall without teleporting animals or skipping a warning.
  const dt = Math.max(0, Math.min(50, elapsed));
  const px = player.x + player.w / 2,
    feet = player.y + player.h;
  for (const a of level.wildlife || []) {
    if (Math.abs(a.homeX - px) > 1500) continue;
    a.flightTime += dt;
    a.messageTime = Math.max(0, a.messageTime - dt);
    a.cooldown = Math.max(0, a.cooldown - dt);
    updateWildlifePickup(a, dt);
    const near = Math.abs(px - a.x) < 135 && Math.abs(feet - a.homeY) < 75;
    if (a.species === "bat") {
      updateAdventureBat(a, dt, px, feet);
      continue;
    }
    if (a.species === "bird") {
      if (!a.helped && a.phase === "idle" && Math.abs(px - a.homeX) < 210) {
        a.phase = "deliver";
        wildlifeMessage(a, "A GIFT — FOLLOW");
      }
      if (a.phase === "deliver") {
        moveWildlife(a, a.rewardX, 90, dt);
        a.y += (a.rewardY - 75 - a.y) * (1 - Math.exp(-dt / 350));
        if (
          Math.abs(a.y - (a.rewardY - 75)) < 5 &&
          Math.abs(a.x - a.rewardX) < 2
        ) {
          dropWildlifeCoins(a, 3, a.y);
          a.phase = "return";
        }
      } else {
        a.y += (a.homeY - a.y) * (1 - Math.exp(-dt / 450));
        wanderWildlife(a, dt, 55);
      }
      continue;
    }
    if (a.species === "deer") {
      if (!a.helped && near && player.isDucking && Math.abs(player.vx) < 1) {
        moveWildlife(a, a.x, 0, dt);
        a.calm += dt;
        if (a.calm >= 900) {
          a.helped = true;
          const max = state.upgrades.maxHp ? 10 : 8;
          const healed = Math.min(2, Math.max(0, max - state.lives));
          state.lives = Math.min(max, state.lives + 2);
          if (!healed) player.hasShield = true;
          wildlifeMessage(
            a,
            healed
              ? `TRUST EARNED · +${healed} HEALTH`
              : "TRUST EARNED · SHIELD",
          );
          sfxBell();
        }
      } else {
        a.calm = 0;
        if (!a.helped && near && !player.isDucking && a.phase !== "flee") {
          a.phase = "flee";
          a.targetX = a.homeX + (px < a.x ? 1 : -1) * a.range * 0.85;
        }
        if (a.phase === "flee") {
          moveWildlife(a, a.targetX, 120, dt);
          if (!near) {
            a.phase = "idle";
            a.timer = 900;
          }
        } else wanderWildlife(a, dt, 24);
      }
    } else if (a.species === "rabbit" || a.species === "lizard") {
      if (!a.helped && near && a.phase === "idle") a.phase = "lead";
      if (a.phase === "lead") {
        moveWildlife(a, a.rewardX, a.species === "rabbit" ? 100 : 85, dt);
        if (Math.abs(a.x - a.rewardX) < 2 && near) {
          a.phase = "work";
          a.timer = a.species === "rabbit" ? 850 : 600;
        }
      } else if (a.phase === "work") {
        moveWildlife(a, a.rewardX, 0, dt);
        a.timer -= dt;
        if (a.timer <= 0) {
          if (a.species === "rabbit") {
            dropWildlifeCoins(a, 5);
            wildlifeMessage(a, "FOUND A CACHE");
          } else {
            a.helped = true;
            a.trap.wildlifeDisabledUntil = level.adventureTime + 12000;
            wildlifeMessage(a, "VALVE CLOSED · 12 SECONDS");
            sfxBell();
          }
          a.phase = "rest";
        }
      } else if (a.phase === "rest") moveWildlife(a, a.rewardX, 0, dt);
      else wanderWildlife(a, dt, 25);
    }
  }
}

function wanderWildlife(a, dt, speed) {
  a.timer -= dt;
  if (a.timer <= 0 && Math.abs(a.targetX - a.x) < 3) {
    a.targetX = a.homeX + (a.targetX >= a.homeX ? -1 : 1) * a.range * 0.6;
    a.timer = 1100 + (a.homeX % 600);
  }
  moveWildlife(a, a.targetX, speed, dt);
}

function updateAdventureBat(a, dt, px, feet) {
  if (
    a.phase === "idle" &&
    a.cooldown === 0 &&
    player.onGround &&
    Math.abs(feet - GROUND_Y) < 8 &&
    Math.abs(px - a.homeX) < 145
  ) {
    a.phase = "warn";
    a.timer = 0;
    a.hit = false;
    a.attackDir = px < a.homeX ? -1 : 1;
    a.startX = a.x;
    a.startY = a.y;
  }
  if (a.phase === "warn") {
    a.timer += dt;
    if (a.timer >= 1100 * encounterTuning().warning) {
      a.phase = "swoop";
      a.timer = 0;
    }
  } else if (a.phase === "swoop") {
    a.timer += dt * encounterTuning().speed;
    const t = Math.min(1, a.timer / 1500);
    a.x = a.startX + a.attackDir * 140 * t;
    // Low, flat pass; the last portion rises smoothly back to its roost.
    const depth =
      t < 0.3
        ? Math.sin(((t / 0.3) * Math.PI) / 2)
        : t <= 0.7
          ? 1
          : Math.cos((((t - 0.7) / 0.3) * Math.PI) / 2);
    a.y = a.startY + (GROUND_Y - 46 - a.startY) * depth;
    a.facing = a.attackDir;
    if (!a.hit && overlap(player, { x: a.x - 11, y: a.y - 8, w: 22, h: 16 })) {
      a.hit = true;
      hurtPlayer("ღამურა! დაიხარე ↓", "trap");
      a.phase = "recover";
      a.cooldown = 5000;
      a.vx = 0;
    }
    if (t === 1) {
      a.phase = "recover";
      a.cooldown = 5000;
      a.vx = 0;
    }
  } else if (a.phase === "recover") {
    moveWildlife(a, a.homeX, 80, dt);
    a.y += (a.homeY - a.y) * (1 - Math.exp(-dt / 300));
    if (Math.abs(a.x - a.homeX) < 2 && Math.abs(a.y - a.homeY) < 2)
      a.phase = "idle";
  }
}

function drawWildlifeDetails(a) {
  const x = a.x - camX;
  if (a.species === "lizard") {
    const disabled = (a.trap.wildlifeDisabledUntil || 0) > level.adventureTime;
    ctx.strokeStyle = disabled ? "#97c7ab" : "#6d7b71";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.rewardX - camX, a.homeY - 16);
    ctx.lineTo(a.rewardX - camX, a.homeY - 5);
    ctx.lineTo(a.trap.x - camX, a.homeY - 5);
    ctx.stroke();
    ctx.fillStyle = "#364e4d";
    ctx.fillRect(a.rewardX - camX - 12, a.homeY - 30, 24, 22);
    ctx.strokeStyle = disabled ? "#b6e1b2" : "#d2bc89";
    ctx.beginPath();
    ctx.arc(a.rewardX - camX, a.homeY - 22, 7, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (a.pickup && !a.pickup.taken) {
    const p = a.pickup;
    ctx.fillStyle = "#b9945b";
    ctx.fillRect(p.x - camX, p.y + 4, 20, 16);
    ctx.fillStyle = "#edce82";
    ctx.fillRect(p.x - camX + 5, p.y, 10, 5);
    ctx.fillRect(p.x - camX + 8, p.y + 8, 4, 6);
  }
  let text = a.messageTime > 0 ? a.message : "";
  if (!text && Math.abs(player.x - a.x) < 220) {
    if (a.species === "deer" && !a.helped) text = "HOLD ↓ STILL · EARN TRUST";
    if (a.species === "rabbit" && !a.helped)
      text = a.phase === "work" ? "DIGGING…" : "FOLLOW THE RABBIT";
    if (a.species === "lizard" && !a.helped) text = "FOLLOW TO THE VALVE";
    if (
      a.species === "lizard" &&
      a.trap.wildlifeDisabledUntil > level.adventureTime
    )
      text = `TRAP OFF · ${Math.ceil((a.trap.wildlifeDisabledUntil - level.adventureTime) / 1000)}s`;
  }
  if (a.species === "bat" && (a.phase === "warn" || a.phase === "swoop")) {
    text = a.phase === "warn" ? "BAT SWOOP · HOLD ↓" : "DUCK ↓";
    ctx.strokeStyle = "rgba(226,191,130,.65)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 7]);
    ctx.beginPath();
    ctx.moveTo(a.startX - camX, GROUND_Y - 46);
    ctx.lineTo(a.startX - camX + a.attackDir * 140, GROUND_Y - 46);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (!text) return;
  const y =
    a.species === "bat"
      ? GROUND_Y - 85
      : a.y - (a.species === "deer" ? 82 : 60);
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  const w = ctx.measureText(text).width + 14;
  ctx.fillStyle = "#263a3e";
  ctx.fillRect(x - w / 2, y - 12, w, 19);
  ctx.fillStyle = "#e4d4a8";
  ctx.fillText(text, x, y + 1);
  if (a.calm > 0 && !a.helped) {
    ctx.fillStyle = "#a4c69a";
    ctx.fillRect(x - w / 2, y + 7, w * Math.min(1, a.calm / 900), 3);
  }
}
