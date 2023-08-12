let posX = 0;
let posY = 0;
let size = 40;
let totalOfSquares = 5;

function setup() {
  createCanvas(size * 10, size * 10);
  background(200);
  for (var x = 0; x < width; x += size) {
		for (var y = 0; y < height; y += size) {
			stroke(0);
			strokeWeight(1);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
  drawRandomRedSquares(totalOfSquares);  
}

function draw() {
  fill(0);
  rect(posX, posY, size, size);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    posX = posX - size;
  } else if (keyCode === RIGHT_ARROW) {
    posX = posX + size;
  }

  if (keyCode === DOWN_ARROW) {
    posY = posY + size;
  } else if (keyCode === UP_ARROW) {
    posY = posY - size;
  }
}

function drawRandomRedSquares(count) {
  for (let i = 0; i < count; i++) {
    let gridX = int(random(width / size));
    let gridY = int(random(height / size));
    let x = gridX * size + (size - size / 2) / 2;
    let y = gridY * size + (size -  size / 2) / 2;
    fill(255, 0, 0);
    rect(x, y, size / 2, size / 2);
  }
}