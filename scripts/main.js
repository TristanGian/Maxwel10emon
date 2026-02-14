let balls = [];
let doorOpen = false;
let doorTop = 250;
let doorBottom = 350;
let RADIUS = 5;

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

  for (let i = 0; i < 15; i++) {
    // constructor(x, y, r, id, allBalls)
    balls.push(new Ball(
      random(50, width-50), 
      random(50, height-50), 
      RADIUS, 
      i, 
      balls
    ));
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
  
  // Update and draw all balls
  let leftCount = 0;
  let rightCount = 0;
  
  for (let b of balls) {
    b.collide();
    b.update();
    b.show();
    
    // Count particles in each chamber
    if (b.pos.x < width / 2) {
      leftCount++;
    } else {
      rightCount++;
    }
  }
  
  // Update particle count displays
  updateParticleCounts(leftCount, rightCount);
}

// Update particle count displays in the UI
function updateParticleCounts(left, right) {
  let leftElem = document.getElementById('left-count');
  let rightElem = document.getElementById('right-count');
  if (leftElem) leftElem.textContent = left;
  if (rightElem) rightElem.textContent = right;
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

