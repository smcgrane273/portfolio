# Source Audit

## Original Project

- Source project name: `blink final copy`
- Source path: `/Users/sophie/Documents/updated information (cleaned 4.27.26) /HW 2.9.25/blink final copy`
- Source handling: read-only. No original files were modified, moved, deleted, or overwritten.
- Source git state at time of organization: not a git repository

## Copied Source Files

- `source/index.original-copy.html`
- `source/sketch.original-copy.js`
- `source/style.original-copy.css`
- `source/README.original-copy.md`

## Copied Image Assets

- `images/eyes.png`
- `images/eyes-closed.png`

## Generated Presentation Assets

- `screenshots/pointillist-eyes-wide-hero.jpg`
- `screenshots/pointillist-eyes-archive-thumb.jpg`
- `screenshots/pointillist-eyes-open-still.jpg`
- `screenshots/pointillist-eyes-closed-still.jpg`
- `screenshots/pointillist-eyes-closed-wide.jpg`
- `screenshots/pointillist-eyes-open-closed-study.jpg`

These stills were generated from the copied local image assets using the same pointillist sampling logic described in the original sketch. They are portfolio planning assets and can be replaced later with final captures if desired.

## Original Site Behavior

- Loads p5.js from a CDN.
- Loads `eyes.png` and `eyes-closed.png`.
- Crops the source image to the eye region.
- Samples the image in a regular grid.
- Uses sampled brightness to control dot diameter.
- Click triggers a short blink by swapping to the closed-eye image.
- Pressing `D` toggles dot density.
- Pressing `J` toggles subtle sample jitter.

## Integration Notes

This folder is ready for a future native portfolio case study, but the project has not yet been added to the live archive/work pages. When integrating later, consider showing the open and closed states side by side, plus a short GIF or video of the blink.
