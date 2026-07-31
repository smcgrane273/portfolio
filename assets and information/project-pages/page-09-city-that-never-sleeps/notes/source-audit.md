# Source Audit

## What Was Found

The standalone project contains one primary file:

- `index.html`

The file includes:

- HTML shell
- Inline CSS
- p5.js CDN import
- Inline JavaScript sketch

No separate local image, CSS, JavaScript, video, or asset files were found.

## Important Code Behaviors

- `setup()` creates a full-window canvas.
- `buildCity()` generates six buildings with randomized width, height, position, depth, and window grids.
- `draw()` paints the night sky, moon, and animated buildings.
- Building windows interpolate toward on/off target states over time.
- `doubleClicked()` toggles clicked windows or starts recording if the moon is clicked.
- `startRecording()` uses `canvas.captureStream()` and `MediaRecorder` to create a five-second WebM.

## What Was Copied

- A reference copy of `index.html` was copied to `source/index.original-copy.html`.
- Generated still images were created for presentation planning.
- Notes and metadata were created for future portfolio integration.

## What Was Not Changed

The original folder and its files were not modified.
