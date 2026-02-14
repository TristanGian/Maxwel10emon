let fastParticles = [];
let slowParticles = [];
let doorOpen = false;
let doorTop = 250;
let doorBottom = 350;
let myBox = new Box(10,10,3,4);
console.log(myBox.particleCounts.blue);
dict = {blue : 5, red : 5};
myBox.replaceDict(dict);
console.log(myBox.particleCounts.blue);

function setup() {
  let canvas = createCanvas(800, 600);

  canvas.parent('canvas-container'); 
  for (let i = 0; i < 10; i++) {
    slowParticles.push(new Particle(random(width), random(height), random(-1,1) * random(1, 2), random(-1,1) * random(1, 2), color(0, 0, 255)));
  }
  for (let i = 0; i < 10; i++) {
    fastParticles.push(new Particle(random(width), random(height), random(-1,1) * random(2, 5), random(-1,1) * random(2, 5), color(255, 0, 0)));
  }
}

function draw() {
  background(30);

  // Draw divider with door
  stroke(255);
  strokeWeight(2);
  if (doorOpen) {
    // Draw wall segments with gap for door
    line(width / 2, 0, width / 2, doorTop);
    line(width / 2, doorBottom, width / 2, height);
  } else {
    // Draw complete wall
    line(width / 2, 0, width / 2, height);
  }
  
  // Draw door frame
  stroke(doorOpen ? color(0, 255, 0) : color(255, 0, 0));
  noFill();
  rect(width / 2 - 5, doorTop, 10, doorBottom - doorTop);
  
  // Instructions in the top left corner
  fill(255);
  noStroke();
  textSize(16);
  text('Press SPACE to toggle door', 10, 30);
  text('Door: ' + (doorOpen ? 'OPEN' : 'CLOSED'), 10, 55);

  // Combine all particles for collision detection
  let allParticles = slowParticles.concat(fastParticles);
  
  for (let p of allParticles) {
    p.update();
    p.checkWalls();
    p.checkCenterWall();
    for (let other of allParticles) {
      if (p !== other) p.checkCollision(other);
    }
    p.display();
  }
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
  }
}
