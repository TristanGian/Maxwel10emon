let fastParticles = [];
let slowParticles = [];
let doorOpen = false;
let doorTop = 250;
let doorBottom = 350;

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 10; i++) {
    slowParticles.push(new Particle(random(width), random(height), random(-2, 2), random(-2, 2), color(0, 0, 255)));
  }
  for (let i = 0; i < 10; i++) {
    fastParticles.push(new Particle(random(width), random(height), random(1, 5), random(-5, 5), color(255, 0, 0)));
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
  
  // Instructions
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

class Particle {
  constructor(x, y, vx, vy, ballColor) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 10;
    this.ballColor = ballColor;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  openDoor() {

  }

  checkWalls() {
    if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
    if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;
  }

  checkCenterWall() {
    if (this.x > width / 2 - this.radius && this.x < width / 2 + this.radius) {
      // Check if particle is in door opening area
      if (doorOpen && this.y > doorTop && this.y < doorBottom) {
        // Door is open, allow particle to pass through
        return;
      }
      // Otherwise bounce off wall
      this.vx *= -1;
    }
  }

  checkCollision(other) {
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance < this.radius + other.radius) {
        // Simple elastic collision response
        let nx = dx / distance;
        let ny = dy / distance;

        // Relative velocity
        let rvx = this.vx - other.vx;
        let rvy = this.vy - other.vy;

        // Dot product of relative velocity and normal
        let dot = rvx * nx + rvy * ny;

        if (dot > 0) return; // Particles are moving apart

        // Move particles apart to prevent sticking
        let overlap = this.radius + other.radius - distance;
        this.x -= overlap * nx / 2;
        this.y -= overlap * ny / 2;
        other.x += overlap * nx / 2;
        other.y += overlap * ny / 2;
    }
  }

  display() {
    fill(this.ballColor);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }
}

// Toggle door when spacebar is pressed
function keyPressed() {
  if (key === ' ') {
    doorOpen = !doorOpen;
  }
}