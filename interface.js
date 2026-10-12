/* Canvas interfaces share their geometry with click handling. */
const WorkshopUI = {
  ink: "#28382e",
  paper: "#e9dfc6",
  muted: "#817f6a",
  green: "#677c51",
  hit(x, y, b) {
    return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  },
  text(text, x, y, size = 14, color = this.ink, align = "left") {
    ctx.font = `${size >= 20 ? "bold " : ""}${size}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  },
  button(b, label, enabled = true, primary = false) {
    ctx.fillStyle = primary ? "#63784e" : "#d8ceb6";
    if (!enabled) ctx.fillStyle = "#c6c2b1";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = primary ? "#405333" : "#afa58d";
    ctx.fillRect(b.x, b.y + b.h - 3, b.w, 3);
    this.text(
      label,
      b.x + b.w / 2,
      b.y + b.h / 2 + 5,
      13,
      primary ? "#fff5da" : enabled ? this.ink : "#777b6d",
      "center",
    );
  },
  background() {
    ctx.fillStyle = "#263b33";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#2b4036";
    for (let y = 0; y < H; y += 76) ctx.fillRect(0, y, W, 3);
    ctx.fillStyle = "rgba(10,22,15,.2)";
    for (let x = 20; x < W; x += 58)
      for (let y = 140; y < 590; y += 50) ctx.fillRect(x, y, 3, 3);
  },
  back() {
    return { x: 48, y: 30, w: 100, h: 36 };
  },
  leave() {
    state.mode =
      state.returnMode === "playing" || state.returnMode === "paused"
        ? "playing"
        : state.returnMode || "menu";
    sfxClick();
  },
  wrap(text, x, y, width, size = 13, color = this.muted, maxLines = 2) {
    ctx.font = `${size}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    let line = "",
      row = 0;
    for (const word of text.split(" ")) {
      const next = line ? line + " " + word : word;
      if (ctx.measureText(next).width > width && line) {
        ctx.fillText(line, x, y + row * (size + 5));
        line = word;
        if (++row >= maxLines) return;
      } else line = next;
    }
    ctx.fillText(line, x, y + row * (size + 5));
  },
};

function shopLayout() {
  return {
    top: 180,
    bottom: 576,
    cols: 3,
    w: 344,
    h: 176,
    gap: 20,
    rowGap: 16,
    x: 64,
    tabs: ["upgrades", "skins", "weapons"].map((id, i) => ({
      id,
      x: 64 + i * 190,
      y: 115,
      w: 174,
      h: 40,
    })),
    exchange: { x: 64, y: 607, w: 300, h: 38 },
    promo: { x: 948, y: 607, w: 188, h: 38 },
  };
}
function shopItems() {
  return state.shopTab === "skins"
    ? shopSkins
    : state.shopTab === "weapons"
      ? shopWeapons
      : shopUpgrades;
}
function shopCard(item, i) {
  const l = shopLayout();
  return {
    x: l.x + (i % 3) * (l.w + l.gap),
    y: l.top + Math.floor(i / 3) * (l.h + l.rowGap) - (state.shopScrollY || 0),
    w: l.w,
    h: l.h,
  };
}
function shopItemStatus(item) {
  const t = state.shopTab || "upgrades";
  return {
    owned:
      t === "upgrades"
        ? !!state.upgrades[item.id]
        : (t === "skins"
            ? state.unlockedSkins || ["classic"]
            : state.unlockedWeapons || ["pistol"]
          ).includes(item.id),
    equipped:
      t === "skins"
        ? state.equippedSkin === item.id
        : t === "weapons"
          ? state.equippedWeapon === item.id
          : false,
  };
}
function drawWorkshopIcon(item, x, y) {
  ctx.save();
  ctx.translate(x, y);
  if (state.shopTab === "skins") {
    const pack = item.id === "lasha" ? "lasha" : "newdino";
    const frames = SKIN_FRAMES[pack]?.idle;
    if (
      (item.id === "classic" || item.id === "lasha") &&
      frames?.[0]?.complete
    ) {
      const img = frames[0],
        scale = 58 / img.height;
      ctx.drawImage(img, (-img.width * scale) / 2, -29, img.width * scale, 58);
    } else {
      const palette = {
        gold: "#bfa563",
        cyber: "#749eaa",
        zombie: "#84906a",
        dragon: "#a9654c",
        godzilla: "#657b64",
        ninja: "#48535d",
        robot: "#9ba8a5",
        ghost: "#c7d0bc",
        viking: "#a78561",
        qunem_davita: "#6d7c8d",
      };
      ctx.fillStyle = palette[item.id] || "#698966";
      ctx.fillRect(-18, -20, 32, 30);
      ctx.fillRect(-12, 10, 23, 12);
      ctx.fillRect(-14, 21, 8, 7);
      ctx.fillRect(6, 21, 8, 7);
      ctx.fillRect(-28, 1, 14, 10);
      ctx.fillStyle = "#e8dfc7";
      ctx.fillRect(5, -13, 10, 8);
      ctx.fillStyle = "#24372f";
      ctx.fillRect(10, -11, 4, 4);
    }
  } else if (state.shopTab === "weapons") {
    const colors = {
      plasma: "#70a4a4",
      flamethrower: "#c1965b",
      laser: "#b87a6a",
      triple: "#7c98a6",
    };
    ctx.fillStyle = colors[item.id] || "#53645e";
    const long = item.id !== "pistol";
    ctx.fillRect(-27, -9, long ? 59 : 38, 13);
    ctx.fillRect(-20, 4, 10, 20);
    ctx.fillStyle = "#9c8d72";
    ctx.fillRect(-29, -5, 16, 9);
    ctx.fillStyle = "#263b33";
    ctx.fillRect(long ? 27 : 9, -6, 10, 7);
    ctx.fillStyle = "#a9b2a1";
    ctx.fillRect(-5, -13, 12, 4);
  } else if (item.id === "shield") {
    ctx.fillStyle = "#749184";
    ctx.beginPath();
    ctx.moveTo(-20, -23);
    ctx.lineTo(20, -23);
    ctx.lineTo(17, 8);
    ctx.lineTo(0, 27);
    ctx.lineTo(-17, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#dfd5b5";
    ctx.fillRect(-3, -13, 6, 28);
    ctx.fillRect(-13, -4, 26, 6);
  } else if (item.id === "maxHp") {
    ctx.fillStyle = "#b67566";
    ctx.fillRect(-20, -15, 16, 16);
    ctx.fillRect(4, -15, 16, 16);
    ctx.fillRect(-20, -3, 40, 13);
    ctx.fillRect(-13, 10, 26, 9);
    ctx.fillRect(-5, 19, 10, 8);
  } else if (item.id === "magnet") {
    ctx.fillStyle = "#a96e56";
    ctx.fillRect(-20, -23, 12, 34);
    ctx.fillRect(8, -23, 12, 34);
    ctx.fillRect(-20, 11, 40, 12);
    ctx.fillStyle = "#ded4b7";
    ctx.fillRect(-20, -23, 12, 8);
    ctx.fillRect(8, -23, 12, 8);
  } else if (item.id === "dash") {
    ctx.fillStyle = "#ad9456";
    ctx.beginPath();
    ctx.moveTo(8, -27);
    ctx.lineTo(-17, 5);
    ctx.lineTo(-2, 5);
    ctx.lineTo(-9, 28);
    ctx.lineTo(23, -7);
    ctx.lineTo(7, -7);
    ctx.closePath();
    ctx.fill();
  } else if (item.id === "shotgun") {
    ctx.fillStyle = "#4f625a";
    ctx.fillRect(-27, -9, 58, 7);
    ctx.fillRect(-27, 0, 58, 7);
    ctx.fillStyle = "#997b57";
    ctx.fillRect(-28, 7, 18, 9);
    ctx.fillRect(-11, 7, 9, 15);
    ctx.fillRect(9, -4, 15, 14);
  } else {
    ctx.fillStyle = "#83945e";
    for (let k = 0; k < 3; k++) ctx.fillRect(-24 + k * 16, 16 - k * 16, 18, 8);
    ctx.fillStyle = "#c7ae73";
    ctx.fillRect(14, -26, 8, 16);
    ctx.fillRect(6, -26, 24, 6);
  }
  ctx.restore();
}
function drawWorkshopShop() {
  const u = WorkshopUI,
    l = shopLayout();
  u.background();
  u.button(u.back(), "← BACK");
  u.text("THE WORKSHOP", 184, 57, 28, "#eee4cd");
  u.text("Equipment for the next journey.", 184, 83, 13, "#afb7a4");
  u.text(
    `${state.coinsCollected || 0} COINS`,
    1136,
    42,
    16,
    "#e4ca88",
    "right",
  );
  u.text(
    `${state.shopCoins || 0} SHOP TOKENS`,
    1136,
    66,
    16,
    "#bcc7ad",
    "right",
  );
  const names = { upgrades: "SKILLS", skins: "CHARACTERS", weapons: "WEAPONS" };
  for (const tab of l.tabs)
    u.button(
      tab,
      names[tab.id],
      true,
      (state.shopTab || "upgrades") === tab.id,
    );
  u.text(
    "Collect coins. Exchange them for shop tokens.",
    1136,
    139,
    12,
    "#afb7a4",
    "right",
  );
  const items = shopItems(),
    max = Math.max(
      0,
      Math.ceil(items.length / 3) * (l.h + l.rowGap) -
        l.rowGap -
        (l.bottom - l.top),
    );
  state.shopTargetScrollY = Math.max(
    0,
    Math.min(max, state.shopTargetScrollY || 0),
  );
  state.shopScrollY =
    (state.shopScrollY || 0) +
    (state.shopTargetScrollY - (state.shopScrollY || 0)) * 0.25;
  ctx.save();
  ctx.beginPath();
  ctx.rect(48, l.top, W - 96, l.bottom - l.top);
  ctx.clip();
  items.forEach((item, i) => {
    const b = shopCard(item, i);
    if (b.y + b.h < l.top || b.y > l.bottom) return;
    const status = shopItemStatus(item);
    ctx.fillStyle = "#172a23";
    ctx.fillRect(b.x + 4, b.y + 6, b.w, b.h);
    ctx.fillStyle = u.paper;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = status.equipped ? "#748959" : "#d4c6a4";
    ctx.fillRect(b.x, b.y, b.w, 4);
    ctx.fillStyle = "#dcd2b7";
    ctx.fillRect(b.x + 15, b.y + 20, 74, 83);
    drawWorkshopIcon(item, b.x + 52, b.y + 61);
    const title = item.title.replace(item.icon, "").trim();
    u.wrap(title, b.x + 103, b.y + 32, 225, 15, u.ink, 2);
    u.wrap(item.desc, b.x + 103, b.y + 78, 222, 12, "#67705e", 2);
    u.text(
      status.equipped
        ? "EQUIPPED"
        : status.owned
          ? "OWNED"
          : `${item.cost} TOKENS`,
      b.x + 16,
      b.y + 121,
      11,
      status.owned ? "#5f7751" : "#7b6541",
    );
    u.button({ x: b.x + 16, y: b.y + 137, w: 88, h: 28 }, "PREVIEW");
    u.button(
      { x: b.x + b.w - 135, y: b.y + 137, w: 119, h: 28 },
      status.equipped
        ? "EQUIPPED"
        : status.owned
          ? state.shopTab === "upgrades"
            ? "OWNED"
            : "EQUIP"
          : "BUY",
      !status.equipped &&
        !(status.owned && state.shopTab === "upgrades") &&
        (status.owned || (state.shopCoins || 0) >= item.cost),
      !status.equipped,
    );
  });
  ctx.restore();
  if (max > 0) {
    ctx.fillStyle = "#162c23";
    ctx.fillRect(1152, l.top, 4, l.bottom - l.top);
    const h = (l.bottom - l.top) ** 2 / (max + l.bottom - l.top);
    ctx.fillStyle = "#b7bb98";
    ctx.fillRect(
      1152,
      l.top + (state.shopScrollY / max) * (l.bottom - l.top - h),
      4,
      h,
    );
  }
  u.button(
    l.exchange,
    `${COIN_EXCHANGE_RATE} COINS → 1 SHOP TOKEN`,
    (state.coinsCollected || 0) >= COIN_EXCHANGE_RATE,
  );
  u.text("Scroll to browse the full collection.", 392, 631, 12, "#afb7a4");
  u.button(l.promo, "PROMO CODE");
  if (state.previewModal?.active) drawPreviewModal();
}
function handleWorkshopShop(x, y) {
  const u = WorkshopUI,
    l = shopLayout();
  if (state.previewModal?.active) {
    handlePreviewModalClick(x, y);
    return;
  }
  if (u.hit(x, y, u.back())) {
    u.leave();
    if (state.upgrades.shield) player.hasShield = true;
    if (state.equippedWeapon) player.weaponMode = state.equippedWeapon;
    return;
  }
  if (u.hit(x, y, l.exchange)) {
    exchangeCoins();
    return;
  }
  if (u.hit(x, y, l.promo)) {
    openPromoCodePrompt();
    return;
  }
  for (const tab of l.tabs)
    if (u.hit(x, y, tab)) {
      state.shopTab = tab.id;
      state.shopScrollY = state.shopTargetScrollY = 0;
      sfxClick();
      return;
    }
  if (y < l.top || y > l.bottom) return;
  shopItems().forEach((item, i) => {
    const b = shopCard(item, i);
    if (u.hit(x, y, { x: b.x + 16, y: b.y + 137, w: 88, h: 28 }))
      openPreviewModal(item, state.shopTab || "upgrades");
    else if (u.hit(x, y, { x: b.x + b.w - 135, y: b.y + 137, w: 119, h: 28 }))
      executeItemTransaction(item, state.shopTab || "upgrades");
  });
}

function dirtLevelBlock(i) {
  return {
    x: 176 + (i % 5) * 180,
    y: 156 + Math.floor(i / 5) * 110,
    w: 128,
    h: 86,
  };
}
function drawDirtLevelSelect() {
  const u = WorkshopUI;
  ctx.fillStyle = "#b7c8ba";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#cbd6c4";
  for (const [x, y, w] of [
    [85, 95, 210],
    [450, 66, 160],
    [825, 105, 235],
  ]) {
    ctx.fillRect(x, y, w, 12);
    ctx.fillRect(x + 25, y - 12, w - 60, 12);
  }
  ctx.fillStyle = "#98ad91";
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, 500);
  ctx.lineTo(200, 402);
  ctx.lineTo(420, 492);
  ctx.lineTo(655, 391);
  ctx.lineTo(900, 475);
  ctx.lineTo(1200, 403);
  ctx.lineTo(1200, H);
  ctx.fill();
  u.button(u.back(), "← BACK");
  u.text("CHOOSE YOUR LEVEL", W / 2, 60, 28, "#2b4435", "center");
  u.text(
    "A new path starts with one block.",
    W / 2,
    88,
    13,
    "#51674f",
    "center",
  );
  for (let i = 0; i < Math.min(MAX_LEVELS, LEVELS.length); i++) {
    const b = dirtLevelBlock(i),
      open = i + 1 <= (state.unlockedLevels || 1),
      hover = menuPointer.active && u.hit(menuPointer.x, menuPointer.y, b);
    ctx.fillStyle = "#738365";
    ctx.fillRect(b.x + 6, b.y + 8, b.w, b.h);
    ctx.fillStyle = open ? "#795536" : "#687061";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = open ? "#a0784f" : "#828677";
    ctx.fillRect(b.x + 5, b.y + 12, b.w - 10, 7);
    const colors = open
      ? ["#906a43", "#61472f", "#b08b5f"]
      : ["#757c6c", "#586452", "#8b917f"];
    for (let k = 0; k < 16; k++) {
      const px = 8 + ((k * 37 + i * 13) % 110),
        py = 26 + ((k * 19 + i * 7) % 50);
      ctx.fillStyle = colors[k % 3];
      ctx.fillRect(b.x + px, b.y + py, k % 3 === 0 ? 12 : 6, k % 2 ? 5 : 8);
    }
    ctx.fillStyle = open ? "#607d3d" : "#78856c";
    ctx.fillRect(b.x - 2, b.y, b.w + 4, 11);
    ctx.fillStyle = open ? "#92aa55" : "#a0ac8d";
    ctx.fillRect(b.x, b.y, b.w, 4);
    ctx.fillStyle = open ? "#516b33" : "#6e7b60";
    for (let k = 0; k < 7; k++)
      ctx.fillRect(b.x + 6 + k * 18, b.y + 9, 12, 5 + (k % 3) * 3);
    if (hover && open) {
      ctx.strokeStyle = "#eadbb0";
      ctx.lineWidth = 3;
      ctx.strokeRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8);
    }
    ctx.textAlign = "center";
    ctx.font = "bold 34px monospace";
    ctx.fillStyle = open ? "#3d2c20" : "#505b49";
    ctx.fillText(String(i + 1), b.x + b.w / 2 + 2, b.y + 60);
    ctx.fillStyle = open ? "#fff0c6" : "#c5cabb";
    ctx.fillText(String(i + 1), b.x + b.w / 2, b.y + 58);
  }
  ctx.fillStyle = "#5d763e";
  ctx.fillRect(0, H - 32, W, 9);
  ctx.fillStyle = "#6d5037";
  ctx.fillRect(0, H - 23, W, 23);
  u.text(
    "Finish a level to open the next block.",
    W / 2,
    H - 57,
    13,
    "#344e36",
    "center",
  );
}
function handleDirtLevelSelect(x, y) {
  const u = WorkshopUI;
  if (u.hit(x, y, u.back())) {
    u.leave();
    return;
  }
  for (let i = 0; i < Math.min(MAX_LEVELS, LEVELS.length); i++)
    if (u.hit(x, y, dirtLevelBlock(i))) {
      if (i + 1 > (state.unlockedLevels || 1)) {
        toast("Finish the previous level to unlock this block.", 2200);
        return;
      }
      state.levelIndex = i;
      loadLevel(i);
      state.mode = "playing";
      state.returnMode = "playing";
      sfxClick();
      return;
    }
}

// Four variants for each activity; the next day never reuses yesterday's
// variant for an activity. Save the chosen IDs so unlocking a world cannot
// change a player's board halfway through the day.
const DAILY_QUEST_POOL = [
  ["coins", "მონეტების ბილიკი", "შეაგროვე", [25, 35, 45, 55], "მონეტა", 150],
  ["zombies", "გაასუფთავე გზა", "დაამარცხე", [5, 7, 9, 12], "ზომბი", 160],
  ["jumps", "პარკურის ვარჯიში", "შეასრულე", [15, 20, 25, 30], "ნახტომი", 120],
  ["distance", "გრძელი გზა", "გაიარე", [180, 240, 300, 360], "მეტრი", 150],
  [
    "play_seconds",
    "თავგადასავლის დრო",
    "ითამაშე",
    [90, 120, 150, 180],
    "წამი",
    120,
  ],
  ["shots", "ზუსტი ცეცხლი", "გაისროლე", [15, 20, 25, 30], "ჯერ", 130],
  ["level_win", "მომდევნო მწვერვალი", "დაასრულე", [1, 2, 1, 2], "დონე", 220],
  [
    "score_gain",
    "ქულების შეგროვება",
    "მოიპოვე",
    [400, 600, 800, 1000],
    "ქულა",
    160,
  ],
  [
    "checkpoints",
    "უსაფრთხო ბანაკი",
    "გააქტიურე",
    [2, 3, 2, 4],
    "ჩექფოინთი",
    170,
  ],
  [
    "barrels",
    "კასრების მტვრეველი",
    "გატეხე სროლით",
    [2, 3, 4, 5],
    "კასრი",
    190,
  ],
  ["relics", "ძველი სამყაროს განძი", "იპოვე", [1, 2, 1, 3], "რელიკვია", 220],
  [
    "treasures",
    "საიდუმლო ბილიკი",
    "გახსენი",
    [1, 1, 2, 2],
    "საიდუმლო სკივრი",
    240,
  ],
  [
    "bridge_switches",
    "ხიდის მექანიკოსი",
    "ჩართე",
    [1, 2, 2, 3],
    "დროებითი ხიდი",
    170,
  ],
].flatMap(([type, title, verb, targets, unit, reward]) =>
  targets.map((target, i) => ({
    id: `${type}_daily_${i}`,
    type,
    title,
    desc: `${verb} ${target} ${unit}`,
    target,
    reward: reward + i * 25,
    tier: i < 2 ? "EXPLORER" : "ADVENTURER",
  })),
);
const LEGACY_DAILY_QUESTS = [
  {
    id: "coins_25",
    type: "coins",
    title: "მონეტებზე ნადირობა",
    desc: "შეაგროვე 25 მონეტა",
    target: 25,
    reward: 150,
  },
  {
    id: "zombies_15",
    type: "zombies",
    title: "ზომბების რისხვა",
    desc: "დაამარცხე 15 ზომბი",
    target: 15,
    reward: 200,
  },
  {
    id: "crystals_3",
    type: "crystals",
    title: "კრისტალების ძიება",
    desc: "იპოვე 3 კრისტალი",
    target: 3,
    reward: 250,
  },
  {
    id: "checkpoints_2",
    type: "checkpoints",
    title: "ჩექფოინთების ოსტატი",
    desc: "გააქტიურე 2 ჩექფოინთი",
    target: 2,
    reward: 180,
  },
  {
    id: "trophies_2",
    type: "trophies",
    title: "ოქროს კოლექციონერი",
    desc: "მოიპოვე 2 ოქროს თასი",
    target: 2,
    reward: 300,
  },
  {
    id: "level_win_1",
    type: "level_win",
    title: "გამარჯვება",
    desc: "გაიარე ერთი დონე",
    target: 1,
    reward: 250,
  },
];
function dailyQuestSelection(date, advanced) {
  const ordinal = Math.floor(
    Date.UTC(
      ...date.split("-").map((v, i) => (i === 1 ? Number(v) - 1 : Number(v))),
    ) / 86400000,
  );
  let seed = (ordinal * 2654435761) >>> 0;
  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };
  const types = ["zombies", "play_seconds", "shots", "level_win", "score_gain"];
  if (advanced)
    types.push(
      "checkpoints",
      "barrels",
      "relics",
      "treasures",
      "bridge_switches",
    );
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  return ["coins", "jumps", "distance", ...types.slice(0, 5)].map((type) => {
    const group = DAILY_QUEST_POOL.filter((q) => q.type === type);
    const offset = type.length % 4;
    return group[(ordinal + offset) % 4];
  });
}
let dailyQuestBoardKey = "";
function refreshDailyQuestBoard() {
  const today = getTodayDateString();
  let changed = false;
  if (!state.dailyQuests || state.dailyQuests.lastDate !== today) {
    state.dailyQuests = {
      lastDate: today,
      progress: {},
      claimed: {},
      selectedIds: [],
      bonusClaimed: false,
    };
    changed = true;
    questTravelBuffer.seconds = questTravelBuffer.distance = 0;
  }
  const d = state.dailyQuests;
  if (!Array.isArray(d.selectedIds) || d.selectedIds.length === 0) {
    const preserved = LEGACY_DAILY_QUESTS.filter(
      (q) => (d.progress[q.id] || 0) > 0 || d.claimed[q.id],
    );
    const fresh = dailyQuestSelection(
      today,
      (state.unlockedLevels || 1) >= 15,
    ).filter((q) => !preserved.some((old) => old.type === q.type));
    d.selectedIds = [...preserved, ...fresh].slice(0, 8).map((q) => q.id);
    changed = true;
  }
  const key = today + ":" + d.selectedIds.join(",");
  if (!changed && key === dailyQuestBoardKey && DAILY_QUESTS_LIST.length)
    return;
  dailyQuestBoardKey = key;
  DAILY_QUESTS_LIST = d.selectedIds
    .map((id) =>
      [...DAILY_QUEST_POOL, ...LEGACY_DAILY_QUESTS].find((q) => q.id === id),
    )
    .filter(Boolean);
  if (changed) saveData();
}
const questTravelBuffer = { seconds: 0, distance: 0, lastX: null, level: -1 };
function updateDailyTravel(dt) {
  if (
    state.mode !== "playing" ||
    player.dead ||
    player.isFalling ||
    state.deathCam?.active
  ) {
    questTravelBuffer.lastX = null;
    return;
  }
  checkDailyReset();
  const b = questTravelBuffer;
  if (
    b.level === state.levelIndex &&
    b.lastX !== null &&
    Math.abs(player.x - b.lastX) < 65
  )
    b.distance += Math.abs(player.x - b.lastX) / 10;
  b.lastX = player.x;
  b.level = state.levelIndex;
  b.seconds += dt / 1000;
  if (b.seconds >= 5) {
    const seconds = Math.floor(b.seconds),
      distance = Math.floor(b.distance);
    b.seconds -= seconds;
    b.distance -= distance;
    trackQuestProgress("play_seconds", seconds);
    if (distance > 0) trackQuestProgress("distance", distance);
  }
}
function claimDailyBoardBonus() {
  checkDailyReset();
  const d = state.dailyQuests,
    count = DAILY_QUESTS_LIST.filter(
      (q) => (d.progress[q.id] || 0) >= q.target,
    ).length;
  if (count < 6 || d.bonusClaimed) return;
  d.bonusClaimed = true;
  state.coinsCollected = (state.coinsCollected || 0) + 300;
  saveData();
  sfxBell();
  toast("Daily bonus collected: +300 coins.", 2500);
}
function questCard(i) {
  return {
    x: 64 + (i % 2) * 546,
    y: 151 + Math.floor(i / 2) * 107,
    w: 526,
    h: 96,
  };
}
function questClaimButton(i) {
  const b = questCard(i);
  return { x: b.x + b.w - 114, y: b.y + 55, w: 98, h: 27 };
}
function drawQuestNoticeboard() {
  checkDailyReset();
  const u = WorkshopUI;
  u.background();
  u.button(u.back(), "← BACK");
  u.text("DAILY FIELD NOTES", 184, 57, 28, "#eee4cd");
  const now = new Date(),
    next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    mins = Math.ceil((next - now) / 60000);
  const remaining = `${Math.floor(mins / 60)}h ${mins % 60}m`;
  u.text(
    "Eight new tasks each day. Follow a trail, earn a reward.",
    184,
    83,
    13,
    "#afb7a4",
  );
  u.text(state.dailyQuests.lastDate, 1136, 43, 15, "#ded4b8", "right");
  u.text(`REFRESH IN ${remaining}`, 1136, 68, 12, "#afb7a4", "right");
  const done = DAILY_QUESTS_LIST.filter(
    (q) => (state.dailyQuests.progress[q.id] || 0) >= q.target,
  ).length;
  u.text(
    `${done} / ${DAILY_QUESTS_LIST.length} COMPLETE`,
    64,
    128,
    13,
    "#c6d1b2",
  );
  u.text(
    `${state.coinsCollected || 0} COINS`,
    1136,
    128,
    13,
    "#ddc48a",
    "right",
  );
  DAILY_QUESTS_LIST.forEach((q, i) => {
    const b = questCard(i),
      progress = state.dailyQuests.progress[q.id] || 0,
      claimed = !!state.dailyQuests.claimed[q.id],
      ready = progress >= q.target;
    ctx.fillStyle = "#172a23";
    ctx.fillRect(b.x + 3, b.y + 4, b.w, b.h);
    ctx.fillStyle = claimed ? "#d5d5bc" : u.paper;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = ready ? "#749156" : "#bbaa83";
    ctx.fillRect(b.x, b.y, 5, b.h);
    ctx.fillStyle = "#baaf90";
    ctx.fillRect(b.x + 10, b.y + 8, 4, 4);
    ctx.fillRect(b.x + b.w - 14, b.y + 8, 4, 4);
    u.text(q.title, b.x + 22, b.y + 26, 16, u.ink);
    u.text(`+${q.reward}`, b.x + b.w - 22, b.y + 26, 14, "#7f6942", "right");
    u.text(q.desc, b.x + 22, b.y + 47, 12, "#69705d");
    const barW = 310;
    ctx.fillStyle = "#d0c6a9";
    ctx.fillRect(b.x + 22, b.y + 66, barW, 5);
    ctx.fillStyle = "#6e8652";
    ctx.fillRect(
      b.x + 22,
      b.y + 66,
      barW * Math.min(1, progress / q.target),
      5,
    );
    u.text(
      `${Math.floor(progress)} / ${q.target}`,
      b.x + 345,
      b.y + 72,
      11,
      "#69705d",
    );
    u.button(
      questClaimButton(i),
      claimed ? "COLLECTED" : ready ? "CLAIM" : "IN PROGRESS",
      ready && !claimed,
      ready && !claimed,
    );
  });
  u.text("Complete any six tasks for a daily bonus.", 64, 623, 14, "#d5dac5");
  u.button(
    { x: 740, y: 602, w: 396, h: 43 },
    state.dailyQuests.bonusClaimed
      ? "BONUS COLLECTED"
      : `${Math.min(6, done)} / 6 COMPLETE · CLAIM 300 COINS`,
    done >= 6 && !state.dailyQuests.bonusClaimed,
    done >= 6 && !state.dailyQuests.bonusClaimed,
  );
}
function handleQuestNoticeboard(x, y) {
  checkDailyReset();
  const u = WorkshopUI;
  if (u.hit(x, y, u.back())) {
    u.leave();
    return;
  }
  for (let i = 0; i < DAILY_QUESTS_LIST.length; i++)
    if (u.hit(x, y, questClaimButton(i))) {
      claimQuestReward(DAILY_QUESTS_LIST[i].id);
      return;
    }
  if (u.hit(x, y, { x: 740, y: 602, w: 396, h: 43 })) claimDailyBoardBonus();
}

function drawWorkshopPreview() {
  const modal = state.previewModal;
  if (!modal?.active || !modal.item) return;
  const u = WorkshopUI,
    item = modal.item,
    type = modal.type || "skins";
  const x = 180,
    y = 82.5,
    stage = { x: 200, y: 146.5, w: 380, h: 422 },
    panelX = 604;
  ctx.save();
  ctx.fillStyle = "rgba(15,31,22,.85)";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = u.paper;
  ctx.fillRect(x, y, 840, 510);
  ctx.fillStyle = "#d1c4a3";
  ctx.fillRect(x, y, 840, 5);
  u.text("WORKSHOP / PREVIEW", x + 24, y + 33, 14, "#6c725f");
  u.button({ x: 966, y: 92.5, w: 40, h: 32 }, "×");
  ctx.fillStyle = "#a9b9a0";
  ctx.fillRect(stage.x, stage.y, stage.w, stage.h);
  ctx.fillStyle = "#c7d2b4";
  ctx.fillRect(stage.x + 35, stage.y + 67, 160, 10);
  ctx.fillRect(stage.x + 60, stage.y + 57, 80, 10);
  ctx.fillStyle = "#596e45";
  ctx.fillRect(stage.x + 20, stage.y + 316, stage.w - 40, 8);
  ctx.fillStyle = "#806243";
  ctx.fillRect(stage.x + 20, stage.y + 324, stage.w - 40, 30);
  for (let k = 0; k < 11; k++) {
    ctx.fillStyle = k % 2 ? "#927149" : "#674d32";
    ctx.fillRect(stage.x + 30 + k * 29, stage.y + 335, 11, 7);
  }
  const cx = 390,
    cy = stage.y + 244;
  if (type === "skins" && (item.id === "classic" || item.id === "lasha")) {
    const pack = item.id === "lasha" ? "lasha" : "newdino",
      anim = modal.animState || "idle",
      frames = SKIN_FRAMES[pack]?.[anim];
    if (frames?.length) {
      const img = frames[Math.floor(state.time / 130) % frames.length];
      if (img.complete && img.height) {
        const scale = 155 / img.height;
        ctx.drawImage(
          img,
          cx - (img.width * scale) / 2,
          stage.y + 316 - 155,
          img.width * scale,
          155,
        );
      }
    }
  } else if (type === "weapons") {
    ctx.save();
    ctx.translate(cx - 45, cy);
    drawDetailedGun(ctx, item.id, {
      scale: 2.8,
      recoil: modal.testFiring ? 8 : 0,
      isFiring: modal.testFiring,
      time: state.time,
      showLaser: false,
    });
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(3.3, 3.3);
    drawWorkshopIcon(item, 0, 0);
    ctx.restore();
  }
  if (type === "skins")
    ["idle", "run", "jump"].forEach((pose, i) =>
      u.button(
        { x: 224 + i * 112, y: 522.5, w: 100, h: 32 },
        pose.toUpperCase(),
        true,
        (modal.animState || "idle") === pose,
      ),
    );
  if (type === "weapons")
    u.button(
      { x: 290, y: 520.5, w: 200, h: 36 },
      "TEST FIRE",
      true,
      !!modal.testFiring,
    );
  u.wrap(
    item.title.replace(item.icon, "").trim(),
    panelX,
    stage.y + 35,
    374,
    23,
    u.ink,
    2,
  );
  u.wrap(item.desc, panelX, stage.y + 109, 370, 16, "#6b725e", 3);
  u.text(
    type === "upgrades"
      ? "PERMANENT UPGRADE"
      : type === "skins"
        ? "CHARACTER OUTFIT"
        : "STARTING WEAPON",
    panelX,
    stage.y + 194,
    12,
    "#7d7358",
  );
  u.wrap(
    type === "upgrades"
      ? "Buy once. Keep the skill for every journey."
      : type === "skins"
        ? "Choose your character before heading out."
        : "Equip this weapon for your next level.",
    panelX,
    stage.y + 221,
    364,
    14,
    "#6b725e",
    3,
  );
  u.text(`${item.cost} SHOP TOKENS`, panelX, stage.y + 303, 20, "#79613f");
  u.text(
    `BALANCE ${state.shopCoins || 0}`,
    panelX,
    stage.y + 330,
    13,
    "#6b725e",
  );
  const status = shopItemStatus(item);
  u.button(
    { x: panelX, y: 518.5, w: 390, h: 48 },
    status.equipped
      ? "EQUIPPED"
      : status.owned
        ? type === "upgrades"
          ? "OWNED"
          : "EQUIP"
        : "BUY",
    !status.equipped &&
      !(status.owned && type === "upgrades") &&
      (status.owned || (state.shopCoins || 0) >= item.cost),
    true,
  );
  ctx.restore();
}
