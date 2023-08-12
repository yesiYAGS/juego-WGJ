let posX = 0;
let posY = 0;
let size = 40;
let dogTrail = [];
let totalOfSquares = 5;
let redSquares = [];

function setup() {
  createCanvas(size * 10, size * 10);
  background(200);
  drawGrid();
  drawRandomRedSquares(totalOfSquares);
}

function drawGrid() {
  for (var x = 0; x < width; x += size) {
    for (var y = 0; y < height; y += size) {
      stroke(0);
      strokeWeight(1);
      line(x, 0, x, height);
      line(0, y, width, y);
    }
  }
}

function drawRandomRedSquares(count) {
  for (let i = 0; i < count; i++) {
    let gridX = int(random(width / size));
    let gridY = int(random(height / size));
    let x = gridX * size + (size - size / 2) / 2;
    let y = gridY * size + (size - size / 2) / 2;
    redSquares.push({ x: x, y: y });
    fill(255, 0, 0);
    rect(x, y, size / 2, size / 2);
  }
}

function draw() {
  background(200);
  drawGrid();
  for (let { x, y } of redSquares) {
    fill(255, 0, 0);
    rect(x, y, size / 2, size / 2);
  }
  fill(0);
  for (let { x, y } of dogTrail) {
    rect(x, y, size, size);
  }
  rect(posX, posY, size, size);
}


function keyPressed() {
  let newX = posX;
  let newY = posY;

  if (keyCode === LEFT_ARROW) {
    newX -= size;
  } else if (keyCode === RIGHT_ARROW) {
    newX += size;
  } else if (keyCode === DOWN_ARROW) {
    newY += size;
  } else if (keyCode === UP_ARROW) {
    newY -= size;
  }

  if (
    newX >= 0 &&
    newY >= 0 &&
    newX < width &&
    newY < height &&
    !dogTrail.some(sq => sq.x === newX && sq.y === newY)
  ) {
    dogTrail.push({ x: posX, y: posY });
    posX = newX;
    posY = newY;
  }
}