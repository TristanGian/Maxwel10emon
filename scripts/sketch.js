
let fastParticles = [];
let slowParticles = [];
let isDoorOpen = false;
let doorTop = 250;
let doorBottom = 350;



function setup() {
  // Make canvas responsive to container size
  let container = document.getElementById('canvas-container');
  let w = container.offsetWidth - 100; // Leave some margin
  let h = container.offsetHeight - 100;
  let canvas = createCanvas(w, h);

  canvas.parent('canvas-container'); 
  
  // Position demon relative to canvas
  positionDemon();
  
  // Scale door position to canvas height
  doorTop = height * 0.42;
  doorBottom = height * 0.58;
  
  for (let i = 0; i < 10; i++) {
    slowParticles.push(new Particle("blue",random(width), random(height), Particle.slow, random(0, 2*Math.PI), color(0, 0, 255)));
  }
  for (let i = 0; i < 10; i++) {
    fastParticles.push(new Particle("red", random(width), random(height), Particle.fast, random(0, 2*Math.PI),  color(255, 0, 0)));
  }
}

function draw() {
  background(30);

  // Draw divider with door
  stroke(255);
  strokeWeight(2);
  if (isDoorOpen) {
    // Draw wall segments with gap for door
    line(width / 2, 0, width / 2, doorTop);
    line(width / 2, doorBottom, width / 2, height);
  } else {
    // Draw complete wall
    line(width / 2, 0, width / 2, height);
  }
  
  // Draw door frame
  stroke(isDoorOpen ? color(0, 255, 0) : color(255, 0, 0));
  noFill();
  rect(width / 2 - 5, doorTop, 10, doorBottom - doorTop);
  
  // Instructions in the top left corner
  fill(255);
  noStroke();
  textSize(16);
  text('Press SPACE to toggle door', 10, 30);
  text('Door: ' + (isDoorOpen ? 'OPEN' : 'CLOSED'), 10, 55);

  // Combine all particles for collision detection
  let allParticles = slowParticles.concat(fastParticles);
  
  for (let p of allParticles) {
    p.checkBound();
    p.checkMiddleWall();
    p.updatePosition();
    p.display();
  }
}

// Toggle door when spacebar is pressed
function keyPressed() {
  if (key === ' ') {
    isDoorOpen = !isDoorOpen;
    
    // Change demon image based on door state
    let demonImg = document.querySelector('.demon-overlay');
    if (isDoorOpen) {
      demonImg.src = 'assets/demon_open.png';
    } else {
      demonImg.src = 'assets/demon_closed.png';
    }
  }
}
