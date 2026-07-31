const trees = window.TREE_DATA || [];

const panel = {
  label: document.getElementById('panel-label'),
  health: document.getElementById('panel-health'),
  species: document.getElementById('panel-species'),
  latin: document.getElementById('panel-latin'),
  address: document.getElementById('panel-address'),
  dbh: document.getElementById('panel-dbh'),
  sidewalk: document.getElementById('panel-sidewalk'),
  steward: document.getElementById('panel-steward'),
  problems: document.getElementById('panel-problems'),
  status: document.getElementById('panel-status'),
  treeId: document.getElementById('panel-tree-id'),
  updated: document.getElementById('panel-updated'),
};

const map = L.map('map', {
  zoomControl: false,
  scrollWheelZoom: true,
  preferCanvas: true,
}).setView([40.6907, -73.9647], 15);

L.control.zoom({ position: 'bottomleft' }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 20,
}).addTo(map);

function fillForHealth(health, status) {
  if (status === 'Dead' || status === 'Stump') return '#8C6A3B';
  if (health === 'Good') return '#486A50';
  if (health === 'Fair') return '#7E936B';
  if (health === 'Poor') return '#B7B85E';
  return '#A9ADA3';
}

function sizeForDbh(value) {
  const dbh = Number.parseFloat(value) || 0;
  return Math.max(4, Math.min(11, 3.5 + dbh / 6));
}

function formatValue(value, fallback = '—') {
  return value && String(value).trim() ? value : fallback;
}

function displayHealth(tree) {
  if (tree.status === 'Dead') return 'DEAD';
  if (tree.status === 'Stump') return 'STUMP';
  if (tree.health) return String(tree.health).toUpperCase();
  return 'UNKNOWN';
}

function selectTree(tree, marker) {
  panel.label.textContent = 'TREE HEALTH';
  panel.health.textContent = displayHealth(tree);
  panel.species.textContent = formatValue(tree.spc_common, 'Unknown species');
  panel.latin.textContent = formatValue(tree.spc_latin, 'Latin species name unavailable');
  panel.address.textContent = formatValue(tree.address, 'Address unavailable');
  panel.dbh.textContent = tree.tree_dbh ? `${tree.tree_dbh} in.` : '—';
  panel.sidewalk.textContent = formatValue(tree.sidewalk);
  panel.steward.textContent = formatValue(tree.steward);
  panel.problems.textContent = formatValue(tree.problems, 'None listed');
  panel.status.textContent = formatValue(tree.status, 'Unknown');
  panel.treeId.textContent = formatValue(tree.tree_id);
  panel.updated.textContent = formatValue(tree.created_at);

  if (selectedMarker && selectedMarker !== marker) {
    selectedMarker.setStyle({
      color: '#1F2D24',
      weight: 0.75,
      radius: selectedMarker.defaultRadius,
    });
  }

  marker.setStyle({
    color: '#1F2D24',
    weight: 2,
    radius: marker.defaultRadius + 1,
  });
  selectedMarker = marker;
}

const clusters = L.markerClusterGroup({
  showCoverageOnHover: false,
  spiderfyOnMaxZoom: false,
  maxClusterRadius: 42,
  iconCreateFunction(cluster) {
    return L.divIcon({
      html: `<div class="cluster-badge">${cluster.getChildCount()}</div>`,
      className: 'custom-cluster',
      iconSize: [36, 36],
    });
  },
});

const bounds = [];
let selectedMarker = null;

for (const tree of trees) {
  const latlng = [tree.latitude, tree.longitude];
  bounds.push(latlng);

  const baseRadius = sizeForDbh(tree.tree_dbh);
  const marker = L.circleMarker(latlng, {
    radius: baseRadius,
    color: '#1F2D24',
    weight: 0.75,
    fillColor: fillForHealth(tree.health, tree.status),
    fillOpacity: 0.92,
  });

  marker.defaultRadius = baseRadius;

  marker.bindTooltip(formatValue(tree.spc_common, 'Street tree'), {
    direction: 'top',
    offset: [0, -8],
    className: 'tree-tooltip',
  });

  marker.on('click', () => selectTree(tree, marker));
  marker.on('mouseover', () => {
    if (marker !== selectedMarker) {
      marker.setStyle({ radius: marker.defaultRadius + 0.5 });
    }
  });
  marker.on('mouseout', () => {
    if (marker !== selectedMarker) {
      marker.setStyle({ radius: marker.defaultRadius });
    }
  });

  clusters.addLayer(marker);
}

map.addLayer(clusters);

if (bounds.length) {
  map.fitBounds(bounds, { padding: [36, 36] });
}
