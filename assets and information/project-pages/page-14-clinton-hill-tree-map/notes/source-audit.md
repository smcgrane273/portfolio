# Source Audit

## Original Project

- Source project name: `update drfat one - 2026-05-13 02-24-42 PM EDT`
- Source path: `/Users/sophie/Documents/updated information (cleaned 4.27.26) /street tree/clinton hill tree map/update drfat one - 2026-05-13 02-24-42 PM EDT`
- Source handling: read-only. No original files were modified, moved, deleted, or overwritten.
- Source git commit at time of organization: `d06b41a`
- Source git status observed at time of organization: clean

## Copied Source Files

- `source/index.original-copy.html`
- `source/script.original-copy.js`
- `source/style.original-copy.css`

## Copied Data Files

- `data/trees.original-copy.js`
- `data/tree-summary.json`

## Generated Presentation Assets

- `screenshots/clinton-hill-tree-map-wide-hero.jpg`
- `screenshots/clinton-hill-tree-map-archive-thumb.jpg`
- `screenshots/clinton-hill-tree-map-panel-still.jpg`
- `screenshots/clinton-hill-tree-map-data-study.jpg`

The generated map stills use the copied local latitude/longitude tree records and the original project's color/size logic. They do not depend on external Leaflet or CARTO tile loading.

## Original Site Behavior

- Loads Leaflet and marker clustering from CDNs.
- Loads CARTO light basemap tiles.
- Loads local `window.TREE_DATA`.
- Maps each tree as a circle marker.
- Marker color is based on tree health/status.
- Marker size is based on trunk diameter.
- Markers show species tooltips on hover.
- Clicking a marker populates a detail panel.
- The map fits automatically to all tree bounds.

## Integration Notes

This folder is ready for a future native portfolio case study, but the project has not yet been added to the live archive/work pages. When integrating later, consider using static generated visuals first, then adding a live iframe or screen recording only if the external Leaflet/CARTO dependencies are acceptable.
