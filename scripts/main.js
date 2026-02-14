let balls = [];
let doorOpen = false;
let doorTop = 250;
let doorBottom = 350;
let RADIUS = 5;
const ballCount = 50;

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

  

  leftNumRed = 0;
  leftNumBlue = 0;
  rightNumRed = 0;
  rightNumBlue = 0;
  // makes new balls and updates red/blue and left/right accordingly
  for (let i = 0; i < ballCount; i++) {
    xPos = random(50, width-50);
    let color;
    if (i%2 == 0){ 
      color = 'blue';
      if (xPos < width/2) {
        leftNumBlue++;
      } else {
        rightNumBlue++;
      }
    } else {
      color = 'red';
      if (xPos < width/2) {
        leftNumRed++;
      } else {
        rightNumRed++;
      }
    }




    // constructor(x, y, r, id, allBalls)
    balls.push(new Ball(
      xPos, 
      random(50, height-50), 
      RADIUS, 
      i, 
      balls,
      color
    ));
  }

  leftBox = new Box(leftNumBlue,leftNumRed);
  rightBox = new Box(rightNumBlue,rightNumRed);
  console.log("Right has red balls count: " +rightBox.particleCounts['red']);
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

  updateGameLogic();
}

function updateGameLogic() {

  // update balls
  for (let b of balls) {
    let moved;
    b.collide();
    moved = b.update();
    b.show();
    if (moved == '') {
      continue;
    } else if (moved == 'movedFromLeft') {
      leftBox.removeColor(b.color);
      rightBox.addColor(b.color);
    } else if (moved == 'movedFromRight') {
      rightBox.removeColor(b.color);
      leftBox.addColor(b.color);
    } else {
      console.log("stupid idoit");
    }
    console.log("-----");
    console.log("Blue on left " + leftBox.particleCounts['blue'] + " red on left : " + leftBox.particleCounts['red']);
    console.log("Blue on right " + rightBox.particleCounts['blue'] + " red on right : " + rightBox.particleCounts['red']);
  }

  console.log(leftBox.calcEntropy() + rightBox.calcEntropy());

  // update boxes
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

