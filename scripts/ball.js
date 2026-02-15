class Ball {
	constructor(x, y, r, id, allBalls, color) {
		this.pos = createVector(x, y); // vector object from p5.js
		this.vel = p5.Vector.random2D().mult(random(5, 10)); // random unit velocity vector from p5.js multiplied by random speed
		this.r = r;
		this.m = r * 0.1; // Mass proportional to size
		this.id = id;
		this.others = allBalls;
		this.color = color; // sets the color of a ball
	}

	// Attribute,Data Type,Purpose
	// pos,Vector,Where the ball is.
	// vel,Vector,Where the ball is going.
	// r,Number,How big the ball is.
	// m,Number,How much force the ball carries.
	// id,Number,Which ball this is in the list.
	// others,Array,Access to all other balls for collision detection.

	update() {
		// update position
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;

		// check bound
		if (this.pos.x < RADIUS || this.pos.x > width - RADIUS) {
			this.vel.x *= -1;
			this.pos.x += 2*this.vel.x;
		}
		if (this.pos.y < RADIUS || this.pos.y > height - RADIUS) {
			this.vel.y *= -1;
			this.pos.y += 2*this.vel.y;
		}

		// at center wall
		if (this.pos.x > width / 2 - RADIUS && this.pos.x < width / 2 + RADIUS) {

			// at door
			if (this.pos.y > doorTop && this.pos.y < doorBottom) {
				if (doorOpen) {
					return;
				}
			}
			this.vel.x *= -1;
			// if still in door
			if (this.pos.y > doorTop && this.pos.y < doorBottom) {
				this.pos.x += 5*this.vel.x;
			}
		}
	}

	collide() {
		for (let i = this.id + 1; i < this.others.length; i++) { // this ensures each pair is only checked once     
			let other = this.others[i];
			let distanceVect = p5.Vector.sub(other.pos, this.pos);
			let distanceMag = distanceVect.mag();
			let minDistance = this.r + other.r;

			if (distanceMag < minDistance) {
				// 1. Resolve Overlap
				let overlap = minDistance - distanceMag;
				let nudge = distanceVect.copy().setMag(overlap / 2);
				this.pos.sub(nudge);
				other.pos.add(nudge);

				// 2. Elastic Collision Math
				let normal = p5.Vector.div(distanceVect, distanceMag);
				let tangent = createVector(-normal.y, normal.x);

				let v1n = normal.dot(this.vel);
				let v1t = tangent.dot(this.vel);
				let v2n = normal.dot(other.vel);
				let v2t = tangent.dot(other.vel);

				let v1nAfter = (v1n * (this.m - other.m) + 2 * other.m * v2n) / (this.m + other.m);
				let v2nAfter = (v2n * (other.m - this.m) + 2 * this.m * v1n) / (this.m + other.m);

				let v1nVec = p5.Vector.mult(normal, v1nAfter);
				let v1tVec = p5.Vector.mult(tangent, v1t);
				let v2nVec = p5.Vector.mult(normal, v2nAfter);
				let v2tVec = p5.Vector.mult(tangent, v2t);

				this.vel = p5.Vector.add(v1nVec, v1tVec);
				other.vel = p5.Vector.add(v2nVec, v2tVec);
			}
		}
	}

	show() {
		fill(this.color);
		stroke(255);
		strokeWeight(2);
		circle(this.pos.x, this.pos.y, this.r * 2);
	}
}
