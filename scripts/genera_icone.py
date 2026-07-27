#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent


def make_icon(size: int, destination: Path, maskable: bool = False) -> None:
    image = Image.new("RGB", (size, size), "#101826")
    draw = ImageDraw.Draw(image)
    margin = int(size * (0.2 if maskable else 0.12))
    draw.rounded_rectangle(
        (margin, margin, size - margin, size - margin),
        radius=int(size * 0.12),
        fill="#16a36a",
    )
    rail_x = [int(size * 0.41), int(size * 0.59)]
    for x in rail_x:
        draw.line((x, int(size * 0.28), x, int(size * 0.72)), fill="white", width=max(4, size // 40))
    for y in range(int(size * 0.31), int(size * 0.72), max(12, size // 12)):
        draw.line(
            (int(size * 0.36), y, int(size * 0.64), y),
            fill="white",
            width=max(3, size // 55),
        )
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination)


make_icon(1024, ROOT / "assets/icon.png")
make_icon(1024, ROOT / "assets/adaptive-icon.png", maskable=True)
make_icon(1024, ROOT / "assets/splash-icon.png")
make_icon(48, ROOT / "assets/favicon.png")
make_icon(192, ROOT / "public/icons/icon-192.png")
make_icon(512, ROOT / "public/icons/icon-512.png")
make_icon(512, ROOT / "public/icons/icon-maskable-512.png", maskable=True)
