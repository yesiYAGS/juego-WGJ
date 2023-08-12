let firstKeyPress = true;
let posX = 0;
let posY = 0;
let size = 40;
let dogTrail = [];
let totalOfSquares = 5;
let redSquares = [];

let headImgs = {};
let bodyImgs = {};
let tailImgs = {};

let alerted = new Array(totalOfSquares).fill(false);

function preload() {
  headImgs['r'] = loadImage('assets/head-r.svg');
  headImgs['b'] = loadImage('assets/head-b.svg');
  headImgs['l'] = loadImage('assets/head-l.svg');
  headImgs['t'] = loadImage('assets/head-t.svg');
  bodyImgs['x'] = loadImage('assets/body-x.svg');
  bodyImgs['y'] = loadImage('assets/body-y.svg');
  tailImgs['r'] = loadImage('assets/tail-r.svg');
  tailImgs['b'] = loadImage('assets/tail-b.svg');
}

let currentHeadDirection = 'r';
let currentBodyDirection = 'x';
let initialTailDirection = 'r';

function setup() {
  createCanvas(size * 10, size * 10);
  background(200);
  drawGrid();
  drawRandomRedSquares(totalOfSquares);
  image(headImgs[currentHeadDirection], 0, 0, size, size);
  image(tailImgs[initialTailDirection], 0, 0, size, size);
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
    let x = gridX * size;
    let y = gridY * size;
    redSquares.push({ x: x, y: y });
    fill(255, 0, 0);
    rect(x + size / 4, y + size / 4, size / 2, size / 2);
  }
}

function draw() {
  background(200);
  drawGrid();
  for (let { x, y } of redSquares) {
    fill(255, 0, 0);
    rect(x + size / 4, y + size / 4, size / 2, size / 2);
  }

  if (dogTrail.length > 0) {
    image(tailImgs[initialTailDirection], dogTrail[0].x, dogTrail[0].y, size, size);
  }

  for (let i = 1; i < dogTrail.length; i++) {
    image(bodyImgs[dogTrail[i].direction], dogTrail[i].x, dogTrail[i].y, size, size);
  }

  image(headImgs[currentHeadDirection], posX, posY, size, size);
  
  for (let i = 0; i < redSquares.length; i++) {
    let redSquare = redSquares[i];
    if (posX === redSquare.x && posY === redSquare.y && !alerted[i]) {
      alert("Pisaste una carta");
      alerted[i] = true; 
      break;
    }
  }
}

function keyPressed() {
  const resultadoDado = lanzarDado();
  console.log("Resultado del lanzamiento del dado:", resultadoDado);
  
  if (firstKeyPress) {
    if (keyCode === RIGHT_ARROW) {
      initialTailDirection = 'r';
    } else if (keyCode === DOWN_ARROW) {
      initialTailDirection = 'b';
    }
    firstKeyPress = false;
  }

  for (let step = 0; step < resultadoDado; step++) {
    let newX = posX;
    let newY = posY;
    let directionHead = currentHeadDirection;
    let directionBody = currentBodyDirection;

    if (keyCode === LEFT_ARROW) {
      directionHead = 'l';
      directionBody = 'x';
      newX -= size;
    } else if (keyCode === RIGHT_ARROW) {
      directionHead = 'r';
      directionBody = 'x';
      newX += size;
    } else if (keyCode === DOWN_ARROW) {
      directionHead = 'b';
      directionBody = 'y';
      newY += size;
    } else if (keyCode === UP_ARROW) {
      directionHead = 't';
      directionBody = 'y';
      newY -= size;
    }

    if (
      newX >= 0 &&
      newY >= 0 &&
      newX < width &&
      newY < height &&
      !dogTrail.some(sq => sq.x === newX && sq.y === newY)
    ) {
      currentHeadDirection = directionHead; 
      dogTrail.push({ x: posX, y: posY, direction: directionBody });
      posX = newX;
      posY = newY;
    }
  }
}
