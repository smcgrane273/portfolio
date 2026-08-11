/*
  Pointillist Eyes + Blink Swap (p5.js)
  Images expected: eyes.png and eyes-closed.png in same folder as index.html
*/

// -----------------------------
// Editable Parameters
// -----------------------------
const params = {
  // Pointillism
  sampleStep: 10,         // dot spacing in source pixels (larger = chunkier, less detail)
  maxDot: 16,             // max dot diameter (scaled to display)
  dotAlpha: 210,          // 0..255
  jitterOn: false,        // subtle jitter toggle (default off)
  jitterAmount: 0.35,     // pixels in source space

  // Crop (normalized 0..1 in source image)
  crop: { x: 0.08, y: 0.28, w: 0.84, h: 0.45 },

  // Eye regions (normalized 0..1 in cropped image)
  eye: {
    left:  { cx: 0.33, cy: 0.52, w: 0.26, h: 0.18 },
    right: { cx: 0.68, cy: 0.52, w: 0.26, h: 0.18 }
  },

  // Blink timing (ms)
  blinkDuration: 300,
};

// -----------------------------
// State
// -----------------------------
let imgOpen = null;
let imgLoaded = false;
let imgLoadError = false;
let imgClosed = null;
let imgClosedLoaded = false;
let imgClosedError = false;
let activeImg = null;
let pg = null;
let pgClosed = null;

let fit = { x: 0, y: 0, w: 0, h: 0 };

let blinkTimer = null;

let densityMode = 0; // 0: sampleStep=4, 1: sampleStep=6

// -----------------------------
// Preload
// -----------------------------
function preload() {
  // Hard requirement says eyes.png
  imgOpen = loadImage(
    'eyes.png',
    () => { imgLoaded = true; },
    () => { imgLoadError = true; }
  );

  // Optional closed-eyes reference for better blink
  imgClosed = loadImage(
    'eyes-closed.png',
    () => { imgClosedLoaded = true; },
    () => { imgClosedError = true; }
  );
}

// -----------------------------
// Setup
// -----------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  activeImg = imgOpen;
  buildBuffer();
}

function buildBuffer() {
  pg = createGraphics(windowWidth, windowHeight);
  pg.pixelDensity(1);
  pg.noStroke();
  pg.clear();

  pgClosed = createGraphics(windowWidth, windowHeight);
  pgClosed.pixelDensity(1);
  pgClosed.noStroke();
  pgClosed.clear();

  if (!imgLoaded || imgLoadError || !activeImg) return;

  const cropRect = getCropRect(activeImg, params.crop);
  fit = fitRectContain(cropRect.w, cropRect.h, windowWidth, windowHeight);

  renderPointillism(activeImg, cropRect, fit, pg);

  if (imgClosedLoaded && !imgClosedError) {
    const closedCrop = getCropRect(imgClosed, params.crop);
    renderPointillism(imgClosed, closedCrop, fit, pgClosed);
  }
}

// -----------------------------
// Draw
// -----------------------------
function draw() {
  clear();

  if (imgLoadError) {
    drawErrorMessage();
    return;
  }

  if (!imgLoaded) {
    drawLoadingMessage();
    return;
  }

  image(pg, 0, 0);

}

// -----------------------------
// Interaction
// -----------------------------
function mousePressed() {
  if (imgLoadError) return;
  triggerBlink();
}

function keyPressed() {
  if (key === 'd' || key === 'D') {
    densityMode = (densityMode + 1) % 2;
    params.sampleStep = densityMode === 0 ? 4 : 6;
    buildBuffer();
  }

  if (key === 'j' || key === 'J') {
    params.jitterOn = !params.jitterOn;
    buildBuffer();
  }
}

function triggerBlink() {
  if (!imgLoaded || imgLoadError) return;
  if (!imgClosedLoaded || imgClosedError) return;

  if (blinkTimer) {
    clearTimeout(blinkTimer);
    blinkTimer = null;
  }

  activeImg = imgClosed;
  buildBuffer();
  redraw();

  blinkTimer = setTimeout(() => {
    activeImg = imgOpen;
    buildBuffer();
    redraw();
    blinkTimer = null;
  }, params.blinkDuration);
}

// -----------------------------
// Helpers
// -----------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildBuffer();
}

function fitRectContain(sw, sh, dw, dh) {
  const sRatio = sw / sh;
  const dRatio = dw / dh;
  let w, h, x, y;

  if (sRatio > dRatio) {
    w = dw;
    h = dw / sRatio;
  } else {
    h = dh;
    w = dh * sRatio;
  }

  x = (dw - w) / 2;
  y = (dh - h) / 2;

  return { x, y, w, h };
}

function getCropRect(image, crop) {
  const x = Math.floor(clamp(crop.x, 0, 1) * image.width);
  const y = Math.floor(clamp(crop.y, 0, 1) * image.height);
  const w = Math.floor(clamp(crop.w, 0, 1) * image.width);
  const h = Math.floor(clamp(crop.h, 0, 1) * image.height);

  return {
    x,
    y,
    w: Math.max(1, Math.min(image.width - x, w)),
    h: Math.max(1, Math.min(image.height - y, h))
  };
}

function renderPointillism(image, cropRect, fitRect, target) {
  image.loadPixels();
  const step = params.sampleStep;
  const jitter = params.jitterOn ? params.jitterAmount : 0;

  for (let sy = cropRect.y; sy < cropRect.y + cropRect.h; sy += step) {
    for (let sx = cropRect.x; sx < cropRect.x + cropRect.w; sx += step) {
      const jx = jitter ? random(-jitter, jitter) : 0;
      const jy = jitter ? random(-jitter, jitter) : 0;

      const sampleX = clamp(Math.floor(sx + jx), 0, image.width - 1);
      const sampleY = clamp(Math.floor(sy + jy), 0, image.height - 1);
      const c = image.get(sampleX, sampleY);

      const b = brightness(c); // 0..100
      const t = 1 - (b / 100); // darker -> larger
      if (t < 0.08) continue;

      const d = lerp(1.2, params.maxDot, t) * (fitRect.w / cropRect.w);
      const alpha = params.dotAlpha * constrain(t * 2.4, 0, 1);

      const dx = map(sampleX - cropRect.x, 0, cropRect.w, fitRect.x, fitRect.x + fitRect.w);
      const dy = map(sampleY - cropRect.y, 0, cropRect.h, fitRect.y, fitRect.y + fitRect.h);

      target.fill(red(c), green(c), blue(c), alpha);
      target.ellipse(dx, dy, d, d);
    }
  }
}

function closeOpen(t) {
  t = constrain(t, 0, 1);
  if (t < 0.5) {
    return easeInOut(t * 2);
  }
  return easeInOut((1 - t) * 2);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2;
}

function drawClosedEye(eye, amount) {
  if (amount <= 0) return;
  if (!imgClosedLoaded || imgClosedError) return;

  const rect = getEyeDisplayRect(eye);
  const ctx = drawingContext;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    rect.x + rect.w / 2,
    rect.y + rect.h / 2,
    rect.w / 2,
    rect.h / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.clip();

  tint(255, 255 * amount);
  image(pgClosed, 0, 0);
  noTint();

  ctx.restore();
}

function getEyeDisplayRect(eye) {
  const cropRect = getCropRect(imgOpen, params.crop);

  // Eye rect in source coordinates
  const eyeCx = cropRect.x + eye.cx * cropRect.w;
  const eyeCy = cropRect.y + eye.cy * cropRect.h;
  const eyeW = eye.w * cropRect.w;
  const eyeH = eye.h * cropRect.h;

  // Map to display space
  const ex = map(eyeCx - eyeW / 2 - cropRect.x, 0, cropRect.w, fit.x, fit.x + fit.w);
  const ey = map(eyeCy - eyeH / 2 - cropRect.y, 0, cropRect.h, fit.y, fit.y + fit.h);
  const ew = map(eyeW, 0, cropRect.w, 0, fit.w);
  const eh = map(eyeH, 0, cropRect.h, 0, fit.h);

  return { x: ex, y: ey, w: ew, h: eh };
}

function clamp(v, minV, maxV) {
  return Math.max(minV, Math.min(maxV, v));
}

function drawErrorMessage() {
  background('#f4f0ea');
  fill(60);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Image not found. Place eyes.png next to index.html', width / 2, height / 2);
}

function drawLoadingMessage() {
  background('#f4f0ea');
  fill(60);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Loading image...', width / 2, height / 2);
}
