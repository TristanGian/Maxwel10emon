let balls = [];
let doorOpen = true;
let doorTop = 250;
let doorBottom = 350;
let RADIUS = 15;
const ballCount = 3;
let demonEntropy = 0;
var leftBalls = [];
var rightBalls = [];

const MASS = 3.35e-26; // mass of 1 neon atom in kg
const k_b = 1.380649e-23; // boltzman constant in joules per kelvin

function setup() {
	frameRate(60);
	// Make canvas responsive to container size
	let container = document.getElementById('canvas-container');
	let w = container.offsetWidth - 200; // Leave some margin
	let h = container.offsetHeight - 200;
	let canvas = createCanvas(w, h);
	let radius = RADIUS; // Define radius for particles

	canvas.parent('canvas-container');

	// Position demon relative to canvas
	positionDemon();

	// Scale door position to canvas height
	doorTop = height * 0.30;
	doorBottom = height * 0.70;



	leftNumRed = 0;
	leftNumBlue = 0;
	rightNumRed = 0;
	rightNumBlue = 0;
	// makes new balls and updates red/blue and left/right accordingly
	for (let i = 0; i < ballCount; i++) {
		let color;
		let randomBool = false;

		if (randomBool) {
			// fill both boxes
			xPos = random(50, width - 50);
			j = Math.random(0, 1);
			if (j <= 0.5) {
				color = 'blue';
				leftNumBlue++;
			}
			if (j > 0.5) {
				color = 'red';
				leftNumRed++;
			}
		}

		if (!randomBool) {
			if (i < ballCount / 2) {
				// fill left box
				xPos = random(50, width / 2 - 50);
				color = 'blue';
				leftNumBlue++;
			} else {
				// fill right box
				xPos = random(50 + width / 2, width - 50);
				color = 'red';
				rightNumRed++;
			}
		}



		// constructor(x, y, r, id, allBalls)
		balls.push(new Ball(
			xPos,
			random(50, height - 50),
			RADIUS,
			i,
			balls,
			color
		));
	}

	leftBox = new Box(leftNumBlue, leftNumRed);
	rightBox = new Box(rightNumBlue, rightNumRed);
  let totalblue = leftNumBlue + rightNumBlue
  let totalred = leftNumRed + rightNumRed
  let templeftbox = new Box(totalblue, 0);
  let temprightbox = new Box(0, totalred);
  let lowestEntropy = templeftbox.calcEntropy() + temprightbox.calcEntropy();
  document.getElementById("min-entropy").textContent = lowestEntropy.toFixed(2);
	//console.log("Right has red balls count: " +rightBox.particleCounts['red']);
}

var leftBox;
var rightBox;


function draw() {
	background(20);

	text('FPS: ' + floor(frameRate()), 10, 20);
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

	// reset some properties for calculations in updateGameLogic()
	leftBox.resetColors();
	rightBox.resetColors();
	leftBalls = [];
	rightBalls = [];

	updateGameLogic();
}

function updateGameLogic() {

	// update balls
	for (let b of balls) {
		let moved;
		b.collide();
		b.update();
		b.show();

		// count how many colors in each box
		if (b.pos.x < width / 2) {
			leftBalls.push(b)
			leftBox.addColor(b.color)
		} else if (b.pos.x > width / 2)
			rightBalls.push(b)
			rightBox.addColor(b.color)
	}

	//console.log("LEFT:  " + leftBox.particleCounts['blue'] + " blue " + leftBox.particleCounts['red'] + " red ");
	//console.log("RIGHT:  " + rightBox.particleCounts['blue'] + " blue " + rightBox.particleCounts['red'] + " red ");
	console.log("LEFT: " + leftBalls.length + "balls")
	console.log("RIGHT: " + rightBalls.length  + "balls")

	// calculate entropy
	var totalEntropy = leftBox.calcEntropy() + rightBox.calcEntropy();
	document.getElementById("sys-entropy").textContent = totalEntropy.toFixed(2);

	// calculate temperatures
	var leftTemp = leftBox.calcTemp(leftBalls);
	document.getElementById("left-temp").textContent = leftTemp.toFixed(2);
	var rightTemp = rightBox.calcTemp(rightBalls);
	document.getElementById("right-temp").textContent = rightTemp.toFixed(2);

}


// Toggle door when spacebar is pressed
function keyPressed() {
	if (key === ' ') {
    demonEntropy += 10;
		doorOpen = !doorOpen;
    document.getElementById("dem-entropy").textContent = demonEntropy;
		// Change demon image based on door state
		let demonImg = document.querySelector('.demon-overlay');
		if (doorOpen) {
			demonImg.src = 'assets/demon_open.png';
		} else {
			demonImg.src = 'assets/demon_closed.png';
		}
	}
}

