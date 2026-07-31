# Pointillist Eyes (p5.js)

This sketch renders a pointillist (Seurat-like) portrait of eyes from a local image and supports wink/blink interactions.

## Run Instructions

Because browsers block local image loading from `file://`, run a local server in this folder:

```bash
python3 -m http.server 8000
```

Then open:

```
http://localhost:8000
```

Alternative:

```bash
npx serve
```

## Files

- `index.html` — loads p5.js and the sketch
- `sketch.js` — full logic
- `style.css` — full-window styling

## Image

Place an image named `eyes.png` in the same folder as `index.html`.

Optional (for more realistic blinks): add `eyes-closed.png` in the same folder.

Your current file name appears to be `eyes copy.png`. Rename it to `eyes.png` or duplicate it with that name.

## Controls

- Single click: wink (right eye)
- Double click: blink (both eyes)
- Press `D`: toggle density mode (sampleStep 4 <-> 6)
- Press `J`: toggle subtle dot jitter

## Editable Parameters

Edit at the top of `sketch.js`:

- `sampleStep` — dot spacing in source pixels
- `maxDot` — max dot size
- `dotAlpha` — dot transparency
- `jitterOn`, `jitterAmount`
- `crop` — normalized crop of source image
- `eye.left`, `eye.right` — normalized eye regions within the crop
- `winkDuration`, `blinkDuration`
