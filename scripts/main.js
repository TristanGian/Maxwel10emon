let balls = [];
let doorOpen = false;
let doorTop = 250;
let doorBottom = 350;
let RADIUS = 10;
let blueCount = 10;
let redCount = 5;
let leftEntropy = 0;
let rightEntropy = 0;
let systemEntropy = 0;      // Total system entropy
let demonEntropy = 0;       // Demon's entropy cost accumulated
let demonBudget = 500;      // Maximum demon entropy budget
let kBT_ln2 = 0.693;        // Cost per measurement: kBT*ln(2)
let doorWasPreviouslyOpen = false;  // Track door state for transitions
let perfectMode = false;    // Perfect demon mode toggle
let entropyChart = null;                // Chart.js instance for entropy over time
let entropyHistory = [];                // Array to store entropy data points
let systemEntropyHistory = [];          // Track system entropy over time
let demonEntropyHistory = [];           // Track demon entropy over time
let lastSystemEntropy = 0;              // Track last system entropy to detect changes
let lastDemonEntropy = 0;               // Track last demon entropy to detect changes
let timeStep = 0;                       // Time counter for x-axis
const MAX_CHART_POINTS = 300;          // Maximum data points to display
let multiplicityChart = null;           // Chart.js instance for multiplicity curve
let currentStateIndex = 0;              // Index of current state on multiplicity curve
let totalEnergy = 0;                    // Total kinetic energy of the system
let leftEnergy = 0;                     // Kinetic energy in left chamber
let rightEnergy = 0;                    // Kinetic energy in right chamber
let systemTemperature = 0;              // System temperature in Kelvin
let leftTemperature = 0;                // Left chamber temperature in Kelvin
let rightTemperature = 0;               // Right chamber temperature in Kelvin
const SPEED_SCALE = 0.01;               // Conversion factor: pixels/frame to m/s
const MASS_SCALE = 0.001;               // Conversion factor: radius units to kg
const k_B = 1.380649e-23;               // Boltzmann's constant in J/K

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
  doorTop = height * 0.32;
  doorBottom = height * 0.68;

  // Initialize particles based on slider values
  initializeParticles();
  
  // Setup slider event listeners
  setupSliders();
  
  // Setup perfect demon toggle
  setupPerfectDemon();
  
  // Initialize entropy chart
  initEntropyChart();
  
  // Initialize multiplicity curve
  initMultiplicityChart();
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
  
  // Reset entropy tracking and chart when particles change
  systemEntropyHistory = [];
  demonEntropyHistory = [];
  lastSystemEntropy = 0;
  lastDemonEntropy = 0;
  timeStep = 0;
  demonEntropy = 0;
  if (entropyChart) {
    entropyChart.data.labels = [];
    entropyChart.data.datasets[0].data = [];
    entropyChart.data.datasets[1].data = [];
    entropyChart.update();
  }
  
  // Reinitialize multiplicity chart with new particle counts
  if (multiplicityChart) {
    initMultiplicityChart();
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

function setupPerfectDemon() {
  let perfectCheckbox = document.getElementById('perfect-demon-checkbox');
  if (perfectCheckbox) {
    perfectCheckbox.addEventListener('change', (e) => {
      perfectMode = e.target.checked;
    });
  }
}

function arrangePerfectParticles() {
  // In perfect mode, automatically control the door to let correct particles through
  // Check if any correct particles are trying to cross the door
  let correctParticleNearDoor = false;
  let centerLine = width / 2;
  
  for (let b of balls) {
    // Check if particle is near the door area
    if (b.pos.y > doorTop && b.pos.y < doorBottom) {
      // Check if moving in correct direction
      if (b.type === 'blue' && b.vel.x < 0) {
        // Blue moving left (correct direction)
        correctParticleNearDoor = true;
        
        break;
      } else if (b.type === 'red' && b.vel.x > 0) {
        // Red moving right (correct direction)
        correctParticleNearDoor = true;
        break;
      }
    }
  }
  
  // Automatically open/close door for particles
  doorOpen = correctParticleNearDoor;
}

// Track entropy cost for particles crossing in perfect mode
function chargePerfectModeCrossings() {
  if (!perfectMode) return;
  
  let centerLine = width / 2;
  
  for (let b of balls) {
    // Initialize charge tracking if needed
    if (b.chargedForCrossing === undefined) {
      b.chargedForCrossing = false;
    }
    
    // Determine if particle is on its correct side
    let isOnCorrectSide = (b.type === 'blue' && b.pos.x < centerLine) ||
                          (b.type === 'red' && b.pos.x > centerLine);
    
    // Check if particle crossed from wrong side to correct side
    let crossedToCorrectSide = (b.type === 'blue' && b.prevX >= centerLine && b.pos.x < centerLine) ||
                               (b.type === 'red' && b.prevX <= centerLine && b.pos.x > centerLine);
    
    // Apply charge when particle successfully reaches correct side
    if (crossedToCorrectSide && !b.chargedForCrossing) {
      demonEntropy += kBT_ln2;
      if (demonEntropy > demonBudget) {
        demonEntropy = demonBudget;
      }
      b.chargedForCrossing = true;
    }
    // Reset charge flag if particle goes back to wrong side
    else if (!isOnCorrectSide) {
      b.chargedForCrossing = false;
    }
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
  
  // Apply perfect demon arrangement if enabled
  if (perfectMode) {
    arrangePerfectParticles();
    
    // Update door visuals when automatically controlled
    let demonImg = document.querySelector('.demon-overlay');
    if (demonImg) {
      demonImg.src = doorOpen ? 'assets/demon_open.png' : 'assets/demon_closed.png';
    }
    
    let statusElem = document.getElementById('door-status');
    if (statusElem) {
      statusElem.textContent = doorOpen ? 'OPEN' : 'CLOSED';
      statusElem.className = doorOpen ? 'status-open' : 'status-closed';
    }
  }
  
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
  
  // Apply perfect mode entropy cost for crossings
  chargePerfectModeCrossings();
  
  // Update entropy chart
  updateEntropyChart();
  
  // Update multiplicity chart to show current state
  updateMultiplicityChart();
  
  // Calculate and display total energy
  calculateAndDisplayEnergy();
}

function calcEntropy(blue_particles, box_particles, area_box, radius) {
    // Avoid division by zero and logarithm of zero
    if (box_particles === 0 || area_box === 0) return 0;
    
    let n = area_box / (Math.PI * radius ** 2); // number of available microstates
    let k = box_particles;
    let b = blue_particles;
    
    // Safety checks to avoid invalid logarithms
    if (k >= n) return 0;
    
    // ===== SPATIAL ENTROPY (current formula) =====
    let spatialEntropy = 0;
    
    if (b > 0 && b < k && k < n) {
        let term1 = n * Math.log(n / (n - k));
        let term2 = k * Math.log((n - k) / (k - b));
        let term3 = b * Math.log((k - b) / b);
        
        // Check for NaN values
        if (!isNaN(term1)) spatialEntropy += term1;
        if (!isNaN(term2)) spatialEntropy += term2;
        if (!isNaN(term3)) spatialEntropy += term3;
    }
    
    // ===== COMBINATORIAL ENTROPY (color distinguishability) =====
    // S_combinatorial = ln(k! / (b! * (k-b)!))
    // This represents how many ways to arrange blue vs red particles
    // Using Stirling's approximation: ln(n!) ≈ n*ln(n) - n
    let colorEntropy = 0;
    if (b > 0 && (k - b) > 0) {
        let lnKFactorial = k * Math.log(k) - k;
        let lnBFactorial = b * Math.log(b) - b;
        let lnKMinusBFactorial = (k - b) * Math.log(k - b) - (k - b);
        colorEntropy = lnKFactorial - lnBFactorial - lnKMinusBFactorial;
        
        if (isNaN(colorEntropy)) colorEntropy = 0;
    }
    
    // Total entropy = spatial + combinatorial
    return spatialEntropy + colorEntropy;
}

function updateEntropyDisplay(leftBlue, leftRed, rightBlue, rightRed) {
    // Calculate the area of each chamber (half the canvas)
    let area_box = (width / 2) * height;
    
    // Calculate system entropy for each chamber
    let leftChamberEntropy = calcEntropy(leftBlue, leftBlue + leftRed, area_box, RADIUS);
    let rightChamberEntropy = calcEntropy(rightBlue, rightBlue + rightRed, area_box, RADIUS);
    let newSystemEntropy = leftChamberEntropy + rightChamberEntropy;
    
    // Track if door was opened or closed (each measurement costs kBT*ln(2))
    if (doorOpen && !doorWasPreviouslyOpen) {
        // Door just opened - demon must pay entropy cost for measurement
        demonEntropy += kBT_ln2;
    }
    doorWasPreviouslyOpen = doorOpen;
    
    // Clamp demon entropy to budget maximum
    if (demonEntropy > demonBudget) {
        demonEntropy = demonBudget;
    }
    if (demonEntropy < 0) {
        demonEntropy = 0;
    }
    
    // Update system entropy
    systemEntropy = newSystemEntropy;
    leftEntropy = leftChamberEntropy;
    rightEntropy = rightChamberEntropy;

    // Update system entropy display
    let entropyElement = document.getElementById('sys-entropy');
    if (entropyElement) {
        entropyElement.textContent = systemEntropy.toFixed(2);
    }
    
    // Update demon entropy display - showing accumulated entropy cost
    let demEntropyElement = document.getElementById('dem-entropy');
    if (demEntropyElement) {
        demEntropyElement.textContent = demonEntropy.toFixed(2);
    }
    
    // Update demon entropy budget gauge bar (0 to 500 scale)
    // This shows how much of the demon's entropy budget has been used
    let demonGaugePercent = (demonEntropy / demonBudget) * 100;
    let demGauge = document.getElementById('dem-gauge');
    if (demGauge) {
        demGauge.style.height = Math.min(100, demonGaugePercent) + '%';
    }
    
    // Update system entropy gauge bar
    // Calculate maximum possible entropy (when particles are equally distributed)
    // Max entropy = when half the particles are on each side
    let maxLeftBlue = blueCount / 2;
    let maxLeftRed = redCount / 2;
    let maxLeftTotal = (blueCount + redCount) / 2;
    let maxChamberEntropy = calcEntropy(maxLeftBlue, maxLeftTotal, area_box, RADIUS);
    let maxSystemEntropy = maxChamberEntropy * 2; // Both chambers have same entropy at equilibrium
    
    let sysGaugePercent = maxSystemEntropy > 0 ? (systemEntropy / maxSystemEntropy) * 100 : 0;
    let sysGauge = document.getElementById('sys-gauge');
    if (sysGauge) {
        sysGauge.style.height = Math.min(100, sysGaugePercent) + '%';
    }
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

// Initialize the entropy over time chart
function initEntropyChart() {
  let chartCanvas = document.getElementById('entropyChart');
  if (!chartCanvas) return;
  
  entropyChart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'System Entropy',
          data: [],
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5
        },
        {
          label: 'Demon Entropy',
          data: [],
          borderColor: '#ff6600',
          backgroundColor: 'rgba(255, 102, 0, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#ccc',
            font: { family: "'Inter', sans-serif", size: 12 },
            usePointStyle: true,
            padding: 15
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: null,
          ticks: {
            color: '#888',
            font: { family: "'JetBrains Mono', monospace", size: 11 }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: '#888',
            font: { family: "'JetBrains Mono', monospace", size: 11 }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          }
        }
      }
    }
  });
}

// Update the entropy chart with new data
function updateEntropyChart() {
  if (!entropyChart) return;
  
  // Only add data point if entropy has changed
  let systemEntropyChanged = Math.abs(systemEntropy - lastSystemEntropy) > 0.001; // Small tolerance for float comparison
  let demonEntropyChanged = Math.abs(demonEntropy - lastDemonEntropy) > 0.001;
  
  if (!systemEntropyChanged && !demonEntropyChanged) {
    return; // No entropy change, don't update chart
  }
  
  // Update tracking variables
  lastSystemEntropy = systemEntropy;
  lastDemonEntropy = demonEntropy;
  
  // Increment time step only when adding a data point
  timeStep++;
  
  // Keep only the last MAX_CHART_POINTS data points
  if (systemEntropyHistory.length > MAX_CHART_POINTS) {
    systemEntropyHistory.shift();
    demonEntropyHistory.shift();
    entropyChart.data.labels.shift();
  }
  
  systemEntropyHistory.push(systemEntropy);
  demonEntropyHistory.push(demonEntropy);
  entropyChart.data.labels.push(timeStep);
  
  entropyChart.data.datasets[0].data = systemEntropyHistory;
  entropyChart.data.datasets[1].data = demonEntropyHistory;
  
  entropyChart.update('none'); // Update without animation for smooth real-time display
}

// Initialize the multiplicity curve showing entropy vs particle distribution
function initMultiplicityChart() {
  let chartCanvas = document.getElementById('multiplicityChart');
  if (!chartCanvas) return;
  
  // Destroy existing chart if it exists
  if (multiplicityChart) {
    multiplicityChart.destroy();
  }
  
  // Calculate entropy for all possible distributions
  let data = calculateMultiplicityData();
  
  multiplicityChart = new Chart(chartCanvas, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Entropy vs Distribution',
          data: data.points,
          borderColor: '#64b5f6',
          backgroundColor: 'rgba(100, 181, 246, 0.15)',
          borderWidth: 2,
          showLine: true,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5
        },
        {
          label: 'Current State',
          data: [{ x: data.currentX, y: data.currentY }],
          borderColor: '#ff6600',
          backgroundColor: '#ff6600',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#ccc',
            font: { family: "'Inter', sans-serif", size: 12 },
            usePointStyle: true,
            padding: 15
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Entropy'
          },
          ticks: {
            color: '#888',
            font: { family: "'JetBrains Mono', monospace", size: 11 }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          }
        },
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Blue Particles on Left'
          },
          ticks: {
            color: '#888',
            font: { family: "'JetBrains Mono', monospace", size: 11 }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          }
        }
      }
    }
  });
}

// Calculate multiplicity data: entropy vs number of blue particles on left
function calculateMultiplicityData() {
  let area_box = (width / 2) * height;
  let points = [];
  let totalBlue = blueCount;
  let totalRed = redCount;
  let totalParticles = totalBlue + totalRed;
  
  // Calculate entropy for each possible distribution of blue particles on left
  for (let blueLeft = 0; blueLeft <= totalBlue; blueLeft++) {
    let blueRight = totalBlue - blueLeft;
    
    // For optimal distribution, reds should be on right
    // When blueLeft blue particles are on left, remaining slots on left go to red
    let leftTotal = Math.round(totalParticles / 2); // Assume even distribution for now
    let redLeft = leftTotal - blueLeft;
    
    // Cap red particles to available
    redLeft = Math.max(0, Math.min(redLeft, totalRed));
    let redRight = totalRed - redLeft;
    
    let leftChamberEntropy = calcEntropy(blueLeft, blueLeft + redLeft, area_box, RADIUS);
    let rightChamberEntropy = calcEntropy(blueRight, blueRight + redRight, area_box, RADIUS);
    let totalEntropy = leftChamberEntropy + rightChamberEntropy;
    
    points.push({ x: blueLeft, y: totalEntropy });
  }
  
  // Find current state position (how many blue are currently on left)
  let currentBlueLeft = 0;
  for (let b of balls) {
    if (b.type === 'blue' && b.pos.x < width / 2) {
      currentBlueLeft++;
    }
  }
  
  // Find entropy value at current state
  let currentStateEntropy = 0;
  let currentIndex = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i].x === currentBlueLeft) {
      currentStateEntropy = points[i].y;
      currentIndex = i;
      break;
    }
  }
  
  return {
    points: points,
    currentX: currentBlueLeft,
    currentY: currentStateEntropy,
    currentIndex: currentIndex
  };
}

// Update the multiplicity chart to show current state
function updateMultiplicityChart() {
  if (!multiplicityChart) return;
  
  let data = calculateMultiplicityData();
  
  // Update current state marker
  multiplicityChart.data.datasets[1].data = [{ x: data.currentX, y: data.currentY }];
  multiplicityChart.update('none');
}

// Calculate total kinetic energy of the system and per-chamber temperatures
// Energy = 0.5 * m * v^2 (in Joules)
function calculateAndDisplayEnergy() {
  totalEnergy = 0;
  leftEnergy = 0;
  rightEnergy = 0;
  let leftParticles = 0;
  let rightParticles = 0;
  
  for (let b of balls) {
    // Convert p5.js velocity (pixels/frame) to m/s
    let speedMS = b.vel.mag() * SPEED_SCALE;
    
    // Convert ball mass (radius-based) to kg
    let massKG = b.m * MASS_SCALE;
    
    // Calculate kinetic energy for this particle: E = 0.5 * m * v^2
    let particleEnergy = 0.5 * massKG * speedMS * speedMS;
    totalEnergy += particleEnergy;
    
    // Add to left or right chamber energy
    if (b.pos.x < width / 2) {
      leftEnergy += particleEnergy;
      leftParticles++;
    } else {
      rightEnergy += particleEnergy;
      rightParticles++;
    }
  }
  
  // Calculate total system temperature from kinetic energy using equipartition theorem
  // For 2D motion with 3 degrees of freedom: E = (3/2) * N * k_B * T
  // Therefore: T = (2/3) * E / (N * k_B)
  let numParticles = balls.length;
  if (numParticles > 0 && totalEnergy > 0) {
    systemTemperature = (2.0 / 3.0) * totalEnergy / (numParticles * k_B);
  } else {
    systemTemperature = 0;
  }
  
  // Calculate left chamber temperature
  if (leftParticles > 0 && leftEnergy > 0) {
    leftTemperature = (2.0 / 3.0) * leftEnergy / (leftParticles * k_B);
  } else {
    leftTemperature = 0;
  }
  
  // Calculate right chamber temperature
  if (rightParticles > 0 && rightEnergy > 0) {
    rightTemperature = (2.0 / 3.0) * rightEnergy / (rightParticles * k_B);
  } else {
    rightTemperature = 0;
  }
  
  // Display total energy in HTML
  let energyElement = document.getElementById('total-energy');
  if (energyElement) {
    energyElement.textContent = totalEnergy.toFixed(6);
  }
  
  // Display system temperature in HTML
  let tempElement = document.getElementById('system-temperature');
  if (tempElement) {
    tempElement.textContent = systemTemperature.toFixed(2);
  }
  
  // Display left chamber temperature
  let leftTempElement = document.getElementById('left-temperature');
  if (leftTempElement) {
    leftTempElement.textContent = leftTemperature.toFixed(2);
  }
  
  // Display right chamber temperature
  let rightTempElement = document.getElementById('right-temperature');
  if (rightTempElement) {
    rightTempElement.textContent = rightTemperature.toFixed(2);
  }
}

// Toggle door when spacebar is pressed
function keyPressed() {
  if (key === ' ') {
    // Don't allow manual door control in perfect mode - gate is automatic
    if (perfectMode) {
      return;
    }
    
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
    
    // Note: Door opening cost (kBT*ln(2)) is applied in updateEntropyDisplay()
    // when doorOpen transitions from false to true
  }
}

