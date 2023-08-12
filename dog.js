let posX = 30;
let posY = 30;
let value = 0;

function setup() {
  createCanvas(400, 400);
  background(200);
}

function draw() {
  fill(0);
  rect(posX, posY, 50, 50);
}
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    posX = posX - 30;
  } else if (keyCode === RIGHT_ARROW) {
    posX = posX + 30;
  }

  if (keyCode === DOWN_ARROW) {
    posY = posY + 30;
  } else if (keyCode === UP_ARROW) {
    posY = posY - 30;
  }
}