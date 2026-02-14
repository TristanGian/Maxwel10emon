class Particle {

	static slow = 2;
	static fast = 5;

  constructor(x, y, v, a, ballColor) {
    this.x = x;
    this.y = y;
    this.vx = v*Math.cos(a);
    this.vy = v*Math.sin(a);
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

        // Need to finish this
    }
  }

  display() {
    fill(this.ballColor);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }
}
