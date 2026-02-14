let balls = [];
let doorOpen = false;
let doorTop = 250;
let doorBottom = 350;
let RADIUS = 10;
let blueCount = 10;
let redCount = 5;
let leftEntropy = 0;
let rightEntropy = 0;

function setup() {
  frameRate(60); 
  // Make canvas responsive to container size
  let container = document.getElementById('canvas-container');
  let w = container.offsetWidth - 200; // Leave some margin
  let h = container.offsetHeight - 200;
  let canvas = createCanvas(w, h);
  let radius = 10; // Define radius for particles

  canvas.parent('canvas-container'); 
  
  // Position demon relative to canvas
  positionDemon();
  
  // Scale door position to canvas height
  doorTop = height * 0.42;
  doorBottom = height * 0.58;

  // Initialize particles based on slider values
  initializeParticles();
  
  // Setup slider event listeners
  setupSliders();
}

function initializeParticles() {
  balls = []; // Clear existing particles
  let particleId = 0;
  
  // Create blue particles
  for (let i = 0; i < blueCount; i++) {
    balls.push(new Ball(
      random(50, width-50), 
      random(50, height-50), 
      RADIUS, 
      particleId++, 
      balls,
      'blue'
    ));
  }
  
  // Create red particles
  for (let i = 0; i < redCount; i++) {
    balls.push(new Ball(
      random(50, width-50), 
      random(50, height-50), 
      RADIUS, 
      particleId++, 
      balls,
      'red'
    ));
  }
  
  // Update all balls' reference to the complete array
  for (let ball of balls) {
    ball.others = balls;
  }
}

function setupSliders() {
  let blueSlider = document.getElementById('blue-slider');
  let redSlider = document.getElementById('red-slider');
  
  if (blueSlider) {
    blueSlider.addEventListener('input', (e) => {
      blueCount = parseInt(e.target.value);
      document.getElementById('blue-value').textContent = blueCount;
      initializeParticles();
    });
  }
  
  if (redSlider) {
    redSlider.addEventListener('input', (e) => {
      redCount = parseInt(e.target.value);
      document.getElementById('red-value').textContent = redCount;
      initializeParticles();
    });
  }
}

function draw() {
  background(10, 14, 39);
  
  // Draw divider with door
  stroke(doorOpen ? color(105, 240, 174, 180) : color(255, 82, 82, 180));
  strokeWeight(3);
  if (doorOpen) {
    // Draw wall segments with gap for door
    line(width / 2, 0, width / 2, doorTop);
    line(width / 2, doorBottom, width / 2, height);
  } else {
    // Draw complete wall
    line(width / 2, 0, width / 2, height);
  }
  
  // Draw door frame with glow effect
  stroke(doorOpen ? color(105, 240, 174) : color(255, 82, 82));
  strokeWeight(2);
  noFill();
  rect(width / 2 - 6, doorTop, 12, doorBottom - doorTop);
  
  // Update and draw all balls, tracking by color and chamber
  let leftBlue = 0, leftRed = 0;
  let rightBlue = 0, rightRed = 0;
  
  for (let b of balls) {
    b.collide();
    b.update();
    b.show();
    
    // Count particles by type and chamber
    if (b.pos.x < width / 2) {
      if (b.type === 'blue') leftBlue++;
      else leftRed++;
    } else {
      if (b.type === 'blue') rightBlue++;
      else rightRed++;
    }
  }
  
  // Update particle count displays
  updateParticleCounts(leftBlue, leftRed, rightBlue, rightRed);
//   console.log(entropy);
  updateEntropyDisplay(leftBlue, leftRed, rightBlue, rightRed);
}

function calcEntropy(blue_particles, box_particles, area_box, radius) {
    // Avoid division by zero and logarithm of zero
    if (box_particles === 0 || area_box === 0) return 0;
    
    let n = area_box / (Math.PI * radius ** 2); // number of available microstates
    let k = box_particles;
    let b = blue_particles;
    
    // Safety checks to avoid invalid logarithms
    if (k >= n || b === 0 || k === b) return 0;
    
    let term1 = n * Math.log(n / (n - k));
    let term2 = k * Math.log((n - k) / (k - b));
    let term3 = b * Math.log((k - b) / b);
    
    // Check for NaN values
    if (isNaN(term1)) term1 = 0;
    if (isNaN(term2)) term2 = 0;
    if (isNaN(term3)) term3 = 0;
    
    return term1 + term2 + term3;
}

function updateEntropyDisplay(leftBlue, leftRed, rightBlue, rightRed) {
    // Calculate the area of each chamber (half the canvas)
    let area_box = (width / 2) * height;
    
    leftEntropy = calcEntropy(leftBlue, leftBlue + leftRed, area_box, RADIUS);
    rightEntropy = calcEntropy(rightBlue, rightBlue + rightRed, area_box, RADIUS);

    let totalEntropy = leftEntropy + rightEntropy;

    // Update system entropy display
    let entropyElement = document.getElementById('sys-entropy');
    if (entropyElement) {
        entropyElement.textContent = totalEntropy.toFixed(2);
    }
    
    // Update demon entropy display (could represent information gained)
    let demEntropyElement = document.getElementById('dem-entropy');
    if (demEntropyElement) {
        demEntropyElement.textContent = Math.abs(leftEntropy - rightEntropy).toFixed(2);
    }
    
    // Update vertical gauge bars
    let sysPercent = totalEntropy > 0 ? (leftEntropy / totalEntropy) * 100 : 50;
    let demPercent = totalEntropy > 0 ? (rightEntropy / totalEntropy) * 100 : 50;
    
    let sysGauge = document.getElementById('sys-gauge');
    let demGauge = document.getElementById('dem-gauge');
    
    if (sysGauge) sysGauge.style.height = sysPercent + '%';
    if (demGauge) demGauge.style.height = demPercent + '%';
}

// Update particle count displays in the UI
function updateParticleCounts(leftBlue, leftRed, rightBlue, rightRed) {
  // Update chamber totals
  let leftTotal = leftBlue + leftRed;
  let rightTotal = rightBlue + rightRed;
  
  let leftElem = document.getElementById('left-count');
  let rightElem = document.getElementById('right-count');
  if (leftElem) leftElem.textContent = leftTotal;
  if (rightElem) rightElem.textContent = rightTotal;
  
  // Update color-specific counts
  let leftBlueElem = document.getElementById('left-blue');
  let leftRedElem = document.getElementById('left-red');
  let rightBlueElem = document.getElementById('right-blue');
  let rightRedElem = document.getElementById('right-red');
  
  if (leftBlueElem) leftBlueElem.textContent = leftBlue;
  if (leftRedElem) leftRedElem.textContent = leftRed;
  if (rightBlueElem) rightBlueElem.textContent = rightBlue;
  if (rightRedElem) rightRedElem.textContent = rightRed;
}

// Toggle door when spacebar is pressed
function keyPressed() {
  if (key === ' ') {
    doorOpen = !doorOpen;
    
    // Change demon image based on door state
    let demonImg = document.querySelector('.demon-overlay');
    if (doorOpen) {
      demonImg.src = 'assets/demon_open.png';
    } else {
      demonImg.src = 'assets/demon_closed.png';
    }
    
    // Update door status display
    let statusElem = document.getElementById('door-status');
    let statusContainer = statusElem.closest('.door-status');
    if (statusElem) {
      statusElem.textContent = doorOpen ? 'OPEN' : 'CLOSED';
      statusElem.className = doorOpen ? 'status-open' : 'status-closed';
    }
    if (statusContainer) {
      statusContainer.className = doorOpen ? 'door-status open' : 'door-status closed';
    }
  }
}

