# Clinton Hill Tree Map

First-pass portfolio preparation folder for the standalone website project `update drfat one - 2026-05-13 02-24-42 PM EDT`.

This is a separate presentation copy. The original standalone project was not moved, edited, deleted, or overwritten.

## Source

- Original source folder: `/Users/sophie/Documents/updated information (cleaned 4.27.26) /street tree/clinton hill tree map/update drfat one - 2026-05-13 02-24-42 PM EDT`
- Source files copied here for reference: `source/`
- Data file copied here for reference: `data/trees.original-copy.js`
- Original project format: Leaflet/CARTO interactive map with local tree census data
- Original page title: `Clinton Hill Tree Map`
- Source git commit at time of organization: `d06b41a`

## Project Summary

`Clinton Hill Tree Map` is an interactive web map of street trees in Clinton Hill, Brooklyn. It uses Leaflet, marker clustering, CARTO basemap tiles, and a local `TREE_DATA` dataset to render tree points by location, health, status, and trunk diameter.

The interface includes a map, filter bar, clustered tree markers, hover tooltips, and a detail panel that updates when a tree is selected. The selected record shows health, species, Latin name, address, diameter, sidewalk condition, stewardship, problems, status, tree ID, and update date.

## Data Snapshot

- Total tree records: 2,792
- Alive: 2,686
- Stumps: 69
- Dead: 37
- Good health: 2,286
- Fair health: 334
- Poor health: 66
- Unknown health: 106

Top species include London planetree, honeylocust, pin oak, ginkgo, Callery pear, littleleaf linden, and Sophora.

## Folder Structure

- `source/`: reference copies of the original web project files.
- `data/`: copied tree dataset and generated data summary.
- `screenshots/`: generated presentation stills based on the local tree data and original UI structure.
- `notes/`: editorial and integration notes for a future portfolio page.
- `project.json`: structured metadata for later integration.

## Strong Visual Moments

- The tree points create a dense neighborhood-scale street pattern.
- Marker size reflects tree diameter.
- Marker color reflects health/status.
- The side panel turns a map point into a detailed census record.
- The filter bar suggests multiple ways to read the same urban dataset.

## Suggested Future Page Direction

This project could become a data visualization or civic-interface case study. A future page might show the full map, the selected-tree detail panel, and a data summary explaining how health, size, species, and stewardship are encoded.
