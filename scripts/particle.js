size = 12;

class Particle {
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

    constructor(color, positionX, positionY, speed, colorValue) {
        this.color = color;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = speed;
        this.radius = size;
        let angle = random(0,360);
        this.velocityX = speed * Math.cos(angle);
        this.velocityY = speed * Math.sin(angle);
        this.colorValue = colorValue;
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
        fill(this.colorValue);
        noStroke();
        ellipse(this.positionX, this.positionY, this.radius * 2);
    }
}
