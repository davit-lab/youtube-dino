#!/usr/bin/env python3
"""Character art pipeline for Geodino.

Turns the supplied airbrushed cut-out frames into a single coherent,
hand-drawn-cartoon style sprite set:

  * every frame is re-placed on ONE uniform canvas per pack (stable sprite
    dimensions + stable pivot),
  * frames are aligned by their foot contact point (no sliding feet),
  * colours are flattened to a single limited palette shared by every frame
    (cel shading, 2-3 tones per material),
  * a confident dark outline is added around the silhouette.

The original frames under  newdino.png/  and  lasha.png/  are treated as the
read-only source of truth.  Output is written to  assets/character/  together
with a manifest consumed by the renderer.  Idempotent: running twice rebuilds
from the pristine source each time.
"""
from __future__ import annotations

import json
import os
import sys
from collections import Counter

from PIL import Image, ImageChops, ImageFilter, ImageDraw, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = {
    "newdino": os.path.join(ROOT, "newdino.png"),
    "lasha": os.path.join(ROOT, "lasha.png"),
}
OUT = os.path.join(ROOT, "assets", "character")
ARTIFACTS = os.path.join(ROOT, "artifacts")

ANIMS = {
    "newdino": ["idle", "walk", "run", "jump", "shoot"],
    "lasha": ["idle", "walk", "run", "jump", "fall", "hurt", "death",
              "shoot_laser", "special_attack"],
}

# Art-direction constants ---------------------------------------------------
PALETTE_SIZE = 30          # total distinct colours per pack (limited palette)
POSTERIZE_LEVELS = 7       # pre-flatten gradients so cel bands read cleanly
OUTLINE_RADIUS = 2         # outline thickness in source pixels
OUTLINE_COLOR = (24, 20, 34, 255)   # dark desaturated indigo
MARGIN_TOP = 4
MARGIN_BOTTOM = 3
MARGIN_SIDE = 4
FOOT_BAND = 0.30           # fraction of height used for the foot centroid


def load_frames(pack: str, anim: str):
    d = os.path.join(SOURCES[pack], anim)
    files = sorted(f for f in os.listdir(d) if f.lower().endswith(".png"))
    return [(f, Image.open(os.path.join(d, f)).convert("RGBA")) for f in files]


def opaque_bbox(im: Image.Image):
    a = im.getchannel("A").point(lambda v: 255 if v > 60 else 0)
    return a.getbbox()


def anchor_point(im: Image.Image, bbox):
    """Return (foot_x, baseline_y) in image coordinates."""
    minx, miny, maxx, maxy = bbox
    baseline = maxy - 1
    band_top = max(miny, int(baseline - (baseline - miny) * FOOT_BAND))
    px = im.load()
    xs = []
    for y in range(band_top, baseline + 1):
        for x in range(minx, maxx):
            if px[x, y][3] > 60:
                xs.append(x)
    if not xs:
        return (minx + maxx - 1) / 2.0, baseline
    return sum(xs) / len(xs), baseline


def collect_palette(frames):
    """k-means over subsampled opaque pixels -> shared limited palette."""
    samples = []
    stride = 5
    for im in frames:
        px = im.load()
        w, h = im.size
        for y in range(0, h, 2):
            for x in range(0, w, 2):
                r, g, b, a = px[x, y]
                if a > 120:
                    samples.append((r, g, b))
    if not samples:
        return [(0, 0, 0)]
    samples = samples[::stride] if len(samples) > 6000 else samples
    k = min(PALETTE_SIZE, len(set(samples)))
    # deterministic spread initialisation
    step = max(1, len(samples) // k)
    cents = [samples[i * step % len(samples)] for i in range(k)]
    for _ in range(16):
        sums = [[0, 0, 0, 0] for _ in range(k)]
        for c in samples:
            best, bi = 1 << 30, 0
            for i, ce in enumerate(cents):
                d = (c[0] - ce[0]) ** 2 + (c[1] - ce[1]) ** 2 + (c[2] - ce[2]) ** 2
                if d < best:
                    best, bi = d, i
            s = sums[bi]
            s[0] += c[0]; s[1] += c[1]; s[2] += c[2]; s[3] += 1
        for i in range(k):
            if sums[i][3]:
                cents[i] = (sums[i][0] // sums[i][3],
                            sums[i][1] // sums[i][3],
                            sums[i][2] // sums[i][3])
    return [tuple(c) for c in cents]


def snap_image(im: Image.Image, palette):
    """Map every opaque pixel to the nearest palette colour."""
    bits = max(1, min(8, POSTERIZE_LEVELS.bit_length()))
    post = ImageOps.posterize(im.convert("RGB"), bits)
    ppx = post.load()
    src = im.load()
    w, h = im.size
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    o = out.load()
    cache = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if a <= 60:
                continue
            key = ppx[x, y]
            c = cache.get(key)
            if c is None:
                best, bc = 1 << 30, palette[0]
                for pc in palette:
                    d = (key[0] - pc[0]) ** 2 + (key[1] - pc[1]) ** 2 + (key[2] - pc[2]) ** 2
                    if d < best:
                        best, bc = d, pc
                c = bc
                cache[key] = c
            o[x, y] = (c[0], c[1], c[2], 255)
    return out


def add_outline(im: Image.Image):
    a = im.getchannel("A").point(lambda v: 255 if v > 60 else 0)
    dilated = a.filter(ImageFilter.MaxFilter(OUTLINE_RADIUS * 2 + 1))
    edge = ImageChops.subtract(dilated, a)
    line = Image.new("RGBA", im.size, OUTLINE_COLOR)
    line.putalpha(edge)
    out = line
    out.alpha_composite(im)
    return out


def build_pack(pack: str):
    loaded = {a: load_frames(pack, a) for a in ANIMS[pack]}

    # 1. anchors
    anchors = {}
    for anim, frames in loaded.items():
        for name, im in frames:
            bb = opaque_bbox(im)
            if bb is None:
                anchors[(anim, name)] = (im.width / 2, im.height - 1)
            else:
                anchors[(anim, name)] = anchor_point(im, bb)

    # 2. uniform canvas per pack
    half_w = 0
    above = 0
    for anim, frames in loaded.items():
        for name, im in frames:
            bb = opaque_bbox(im)
            if bb is None:
                continue
            fx, by = anchors[(anim, name)]
            half_w = max(half_w, fx - bb[0], bb[2] - fx)
            above = max(above, by - bb[1])
    half_w += MARGIN_SIDE
    canvas_w = int(half_w * 2)
    canvas_h = int(above + MARGIN_TOP + MARGIN_BOTTOM)
    baseline_y = canvas_h - MARGIN_BOTTOM
    anchor_x = canvas_w / 2.0

    # reference standing height = idle_01 content height
    idle0 = loaded["idle"][0][1]
    ibb = opaque_bbox(idle0)
    ref_h = (ibb[3] - ibb[1]) if ibb else idle0.height

    # 3. palette from all frames
    all_frames = [im for frames in loaded.values() for _, im in frames]
    palette = collect_palette(all_frames)

    manifest = {
        "canvasW": canvas_w,
        "canvasH": canvas_h,
        "anchorX": anchor_x,
        "baselineY": baseline_y,
        "refH": ref_h,
        "outline": OUTLINE_RADIUS,
        "palette": ["#%02x%02x%02x" % c for c in palette],
        "fps": {
            "idle": 6, "walk": 8, "run": 12, "jump": 14, "shoot": 14,
            "fall": 16, "hurt": 10, "death": 8, "shoot_laser": 12,
            "special_attack": 12,
        },
        "anims": {},
    }

    out_dir = os.path.join(OUT, pack)
    contact_rows = []
    for anim, frames in loaded.items():
        adir = os.path.join(out_dir, anim)
        os.makedirs(adir, exist_ok=True)
        names = []
        row = []
        for name, im in frames:
            snapped = snap_image(im, palette)
            fx, by = anchors[(anim, name)]
            canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
            dx = int(round(anchor_x - fx))
            dy = int(round(baseline_y - by))
            canvas.alpha_composite(snapped, (dx, dy))
            canvas = add_outline(canvas)
            canvas.save(os.path.join(adir, name))
            names.append(name)
            row.append(canvas)
        manifest["anims"][anim] = names
        contact_rows.append((anim, row))

    return manifest, contact_rows, palette


def contact_sheet(pack, rows, manifest):
    cell_w = manifest["canvasW"] + 8
    cell_h = manifest["canvasH"] + 8
    max_cols = max(len(r) for _, r in rows)
    sheet = Image.new("RGBA", (max_cols * cell_w, len(rows) * cell_h), (18, 22, 34, 255))
    d = ImageDraw.Draw(sheet)
    for ri, (anim, row) in enumerate(rows):
        for ci, im in enumerate(row):
            x = ci * cell_w + 4
            y = ri * cell_h + 4
            sheet.alpha_composite(im, (x, y))
    os.makedirs(ARTIFACTS, exist_ok=True)
    sheet.save(os.path.join(ARTIFACTS, f"character-contact-{pack}.png"))


def main():
    top_manifest = {}
    report = {}
    for pack in SOURCES:
        manifest, rows, palette = build_pack(pack)
        top_manifest[pack] = manifest
        contact_sheet(pack, rows, manifest)
        report[pack] = {
            "canvas": [manifest["canvasW"], manifest["canvasH"]],
            "palette_size": len(palette),
            "refH": manifest["refH"],
            "anims": {a: len(v) for a, v in manifest["anims"].items()},
        }
    with open(os.path.join(OUT, "manifest.json"), "w") as f:
        json.dump(top_manifest, f, indent=2)
    # keep the legacy frames.json shape (list of filenames per anim)
    legacy = {pack: m["anims"] for pack, m in top_manifest.items()}
    with open(os.path.join(OUT, "frames.json"), "w") as f:
        json.dump(legacy, f, indent=2)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
