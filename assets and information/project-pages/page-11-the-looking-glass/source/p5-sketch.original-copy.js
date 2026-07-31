let cameraFeed;
let fogLayer;
let mistLayer;
let glowLayer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  cameraFeed = createCapture(
    {
      video: {
        facingMode: "user"
      },
      audio: false
    },
    () => {
      cameraFeed.elt.setAttribute("playsinline", "");
    }
  );

  cameraFeed.size(width, height);
  cameraFeed.hide();

  fogLayer = createGraphics(width, height);
  mistLayer = createGraphics(width, height);
  glowLayer = createGraphics(width, height);

  rebuildAtmosphere();
  noCursor();
}

function draw() {
  background(8, 12, 18);

  drawCameraMirror();
  image(glowLayer, 0, 0, width, height);
  image(mistLayer, 0, 0, width, height);

  if (mouseIsPressed) {
    wipeFog(mouseX, mouseY, pmouseX, pmouseY);
  }

  if (touches.length > 0) {
    const touch = touches[0];
    wipeFog(touch.x, touch.y, touch.px ?? touch.x, touch.py ?? touch.y);
  }

  image(fogLayer, 0, 0, width, height);
  drawGlass();
}

function drawCameraMirror() {
  push();
  translate(width, 0);
  scale(-1, 1);

  if (cameraFeed.loadedmetadata) {
    drawingContext.filter = "blur(6px) saturate(0.7) contrast(1.05) brightness(0.9)";
    image(cameraFeed, 0, 0, width, height);
    drawingContext.filter = "none";
  } else {
    const fallback = drawingContext.createLinearGradient(0, 0, 0, height);
    fallback.addColorStop(0, "#23303a");
    fallback.addColorStop(1, "#0b1016");
    drawingContext.fillStyle = fallback;
    drawingContext.fillRect(0, 0, width, height);
  }

  pop();
}

function rebuildAtmosphere() {
  buildGlowLayer();
  buildMistLayer();
  paintFog();
}

function buildGlowLayer() {
  glowLayer.clear();
  glowLayer.noStroke();

  for (let i = 0; i < 3; i += 1) {
    const x = i === 0 ? width * 0.5 : i === 1 ? width * 0.12 : width * 0.88;
    const y = i === 0 ? height * 0.1 : height * 0.18;
    const radius = i === 0 ? min(width, height) * 0.28 : min(width, height) * 0.18;

    for (let r = radius; r > 0; r -= 8) {
      const alpha = map(r, radius, 0, 0, i === 0 ? 30 : 18);
      glowLayer.fill(255, 245, 220, alpha);
      glowLayer.circle(x, y, r * 2);
    }
  }
}

function buildMistLayer() {
  mistLayer.clear();
  mistLayer.noStroke();

  const puffs = [
    [0.14, 0.16, 0.22, 28],
    [0.84, 0.24, 0.28, 24],
    [0.32, 0.78, 0.24, 20],
    [0.72, 0.68, 0.32, 18]
  ];

  for (const [xRatio, yRatio, sizeRatio, alpha] of puffs) {
    const x = width * xRatio;
    const y = height * yRatio;
    const radius = min(width, height) * sizeRatio;

    for (let r = radius; r > 0; r -= 10) {
      mistLayer.fill(255, 255, 255, map(r, radius, 0, 0, alpha));
      mistLayer.ellipse(x, y, r * 1.6, r);
    }
  }
}

function paintFog() {
  fogLayer.clear();
  fogLayer.noStroke();

  const fogGradient = fogLayer.drawingContext.createLinearGradient(0, 0, 0, height);
  fogGradient.addColorStop(0, "rgba(228, 235, 239, 0.92)");
  fogGradient.addColorStop(0.5, "rgba(213, 223, 230, 0.9)");
  fogGradient.addColorStop(1, "rgba(193, 203, 210, 0.95)");
  fogLayer.drawingContext.fillStyle = fogGradient;
  fogLayer.drawingContext.fillRect(0, 0, width, height);

  for (let i = 0; i < 26; i += 1) {
    const x = random(width);
    const y = random(height);
    const radius = random(width * 0.14, width * 0.35);

    for (let r = radius; r > 0; r -= 12) {
      fogLayer.fill(255, 255, 255, map(r, radius, 0, 0, random(5, 14)));
      fogLayer.circle(x, y, r * 2);
    }
  }

  fogLayer.stroke(255, 255, 255, 42);
  fogLayer.strokeCap(ROUND);
  for (let i = 0; i < 40; i += 1) {
    const startX = random(width);
    const startY = random(-height * 0.08, height * 0.22);
    const length = random(height * 0.14, height * 0.44);
    fogLayer.strokeWeight(random(1, 3.2));
    fogLayer.noFill();
    fogLayer.beginShape();
    fogLayer.vertex(startX, startY);
    fogLayer.bezierVertex(
      startX + random(-20, 20),
      startY + length * 0.32,
      startX + random(-26, 26),
      startY + length * 0.7,
      startX + random(-12, 12),
      startY + length
    );
    fogLayer.endShape();
  }

  fogLayer.noStroke();
  const droplets = floor((width * height) / 1500);
  for (let i = 0; i < droplets; i += 1) {
    fogLayer.fill(255, 255, 255, random(6, 18));
    fogLayer.circle(random(width), random(height), random(1, 3));
  }

  fogLayer.fill(255, 255, 255, 12);
  fogLayer.rect(0, 0, width, height);
}

function wipeFog(x1, y1, x2, y2) {
  fogLayer.push();
  fogLayer.erase();

  const distance = dist(x1, y1, x2, y2);
  const steps = max(1, ceil(distance / 14));

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = lerp(x1, x2, t);
    const y = lerp(y1, y2, t);

    for (let r = 78; r > 0; r -= 8) {
      const alpha = map(r, 78, 0, 10, 60);
      fogLayer.fill(255, alpha);
      fogLayer.circle(x, y, r * 2);
    }
  }

  fogLayer.noErase();
  fogLayer.pop();
}

function drawGlass() {
  noFill();

  const edgeGradient = drawingContext.createLinearGradient(0, 0, width, height);
  edgeGradient.addColorStop(0, "rgba(255,255,255,0.14)");
  edgeGradient.addColorStop(0.22, "rgba(255,255,255,0)");
  edgeGradient.addColorStop(0.78, "rgba(255,255,255,0)");
  edgeGradient.addColorStop(1, "rgba(255,255,255,0.08)");
  drawingContext.strokeStyle = edgeGradient;
  drawingContext.lineWidth = 2;
  drawingContext.strokeRect(0, 0, width, height);

  const vignette = drawingContext.createRadialGradient(
    width * 0.5,
    height * 0.5,
    min(width, height) * 0.2,
    width * 0.5,
    height * 0.5,
    max(width, height) * 0.65
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(7,12,18,0.52)");
  drawingContext.fillStyle = vignette;
  drawingContext.fillRect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cameraFeed.size(width, height);
  fogLayer = createGraphics(width, height);
  mistLayer = createGraphics(width, height);
  glowLayer = createGraphics(width, height);
  rebuildAtmosphere();
}

function touchMoved() {
  return false;
}
