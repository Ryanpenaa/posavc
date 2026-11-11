from pathlib import Path
from PIL import Image, ImageOps

SOURCE = Path("public")
DEST = SOURCE / "optimized"
DEST.mkdir(parents=True, exist_ok=True)

for src in SOURCE.glob("*.png"):
    with Image.open(src) as original:
        im = ImageOps.exif_transpose(original)
        im.thumbnail((1200, 1600), Image.Resampling.LANCZOS)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        dst = DEST / (src.stem + ".webp")
        im.save(dst, "WEBP", quality=78, method=6)
        print(f"{src}: {src.stat().st_size:,} -> {dst.stat().st_size:,} bytes")
