class circle{
    color; //String
    position; //dict -> floats
    speed; //float
    radius; //int
    velocity //dict -> floats

    constructor(color, positionX, positionY, speed, radius, velocityX, velocityY) {
        this.color = color;
        this.position.x = positionX;
        this.position.y = positionY;
        this.speed = speed;
        this.radius = radius;
        this.velocity.x = velocityX;
        this.velocity.y = velocityY;
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
        this.position.x += this.velocity.x;
        this.positiony += this.velocity.y;
    }

    

}