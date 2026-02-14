class Particle2{
    color; //String
    // //dict -> floats
    speed; //float
    radius; //int //dict -> floats
    colorValue; //color value (0,0,0)

    constructor(color, positionX, positionY, speed, radius, colorValue) {
        this.color = color;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = speed;
        this.radius = radius;
        let angle = random(0,360);
        this.velocityX = speed * Math.cos(angle);
        this.velocityY = speed * Math.sin(angle);
        this.colorValue = colorValue;
    }

    getColor(){
        return this.color;
    }

    getPosition(){
        return this.position;
    }

    getVelocity(){
        return this.velocity;
    }

    updatePosition(){
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;
    }
    checkBound(){
        if (this.positionX < this.radius || this.positionX > width - this.radius) this.velocityX *= -1;
        if (this.positionY < this.radius || this.positionY > height - this.radius) this.velocityY *= -1;
    }

    checkMiddleWall(isWallOpen){
        if (this.positionX > width / 2 - this.radius && this.positionX < width / 2 + this.radius) {
            if (isWallOpen && this.positionY > doorTop && this.positionY < doorBottom) {
                return;
            }
            this.velocityX *= -1;
        }
    }

    setVelocity(angle){
        this.velocityX = speed * Math.cos(angle);
        this.velocityY = speed * Math.sin(angle);
    }

    display() {
        fill(this.colorValue);
        noStroke();
        ellipse(this.positionX, this.positionY, this.radius * 2);
    }

}