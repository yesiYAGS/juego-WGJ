let firstKeyPress = true;
let posX = 0;
let posY = 0;
let size = 40;
let rollbackCount = 3;
let dogTrail = [];
let totalOfRedSquares = 2;
let totalOfBlueSquares = 6;
let totalOfGreenSquares = 4;
let redSquares = [];
let blueSquares = [];
let greenSquares = [];

let headImgs = {};
let bodyImgs = {};
let tailImgs = {};
let cornerImgs = {};

let alertedRed = new Array(totalOfRedSquares).fill(false);
let alertedBlue = new Array(totalOfBlueSquares).fill(false);
let alertedGreen = new Array(totalOfGreenSquares).fill(false);
let resultadoDado = 0;

function preload() {
  headImgs['r'] = loadImage('assets/head-r.svg');
  headImgs['b'] = loadImage('assets/head-b.svg');
  headImgs['l'] = loadImage('assets/head-l.svg');
  headImgs['t'] = loadImage('assets/head-t.svg');
  bodyImgs['r'] = loadImage('assets/body-x.svg');
  bodyImgs['l'] = loadImage('assets/body-x.svg');
  bodyImgs['t'] = loadImage('assets/body-y.svg');
  bodyImgs['b'] = loadImage('assets/body-y.svg');
  tailImgs['r'] = loadImage('assets/tail-r.svg');
  tailImgs['b'] = loadImage('assets/tail-b.svg');
  cornerImgs['1'] = loadImage('assets/corner-1.svg');
  cornerImgs['2'] = loadImage('assets/corner-2.svg');
  cornerImgs['3'] = loadImage('assets/corner-3.svg');
  cornerImgs['4'] = loadImage('assets/corner-4.svg');
}

let currentHeadDirection = 'r';
let currentBodyDirection = 'r';
let initialTailDirection = 'r';

function setup() {
  createCanvas(size * 10, size * 10);
  background(200);
  drawGrid();
  drawRandomSquares(totalOfRedSquares, redSquares, 255, 0, 0); // Rojo
  drawRandomSquares(totalOfBlueSquares, blueSquares, 0, 0, 255); // Azul
  drawRandomSquares(totalOfGreenSquares, greenSquares, 0, 255, 0); // Verde
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

function drawRandomSquares(count, array, r, g, b) {
  for (let i = 0; i < count; i++) {
    let gridX;
    let gridY;
    let x;
    let y;

    do {
      gridX = int(random(width / size));
      gridY = int(random(height / size));
      x = gridX * size;
      y = gridY * size;
    } while (isSquareOccupied(x, y));

    array.push({ x: x, y: y });
    fill(r, g, b);
    rect(x + size / 4, y + size / 4, size / 2, size / 2);
  }
}

function isSquareOccupied(x, y) {
  for (let square of [...redSquares, ...blueSquares, ...greenSquares]) {
    if (square.x === x && square.y === y) {
      return true;
    }
  }
  return false;
}

function draw() {
  background(200);
  drawGrid();

  drawSquares(redSquares, 255, 0, 0, alertedRed);
  drawSquares(blueSquares, 0, 0, 255, alertedBlue);
  drawSquares(greenSquares, 0, 255, 0, alertedGreen);

  if (dogTrail.length > 0) {
    image(tailImgs[initialTailDirection], dogTrail[0].x, dogTrail[0].y, size, size);
  }

  for (let i = 1; i < dogTrail.length; i++) {
    let segment = dogTrail[i];
    if (segment.corner) {
      image(cornerImgs[segment.corner], segment.x, segment.y, size, size);
    } else {
      image(bodyImgs[segment.direction], segment.x, segment.y, size, size);
    }
  }

  image(headImgs[currentHeadDirection], posX, posY, size, size);

  checkSpecialSquares(redSquares, alertedRed, () => {
    alert("¡Perdiste!");
    location.reload();
  });

  checkSpecialSquares(blueSquares, alertedBlue, () => {
    if (dogTrail.length > rollbackCount) {
      retroceder(rollbackCount);
    }
  });

  checkSpecialSquares(greenSquares, alertedGreen, () => {
    alert("Esta es la personalidad de tu dueño");
  });
}

function activarMovimiento(dado) {
  resultadoDado = dado;
}
function moverDerecha() {
  keyPressed(RIGHT_ARROW);
}

function moverIzquierda() {
  keyPressed(LEFT_ARROW);
}

function moverArriba() {
  keyPressed(UP_ARROW);
}

function moverAbajo() {
  keyPressed(DOWN_ARROW);
}

function keyPressed(keyCode) {
  if (resultadoDado > 0) {
    console.log("Resultado del lanzamiento del dado:", resultadoDado);

    if (firstKeyPress) {
      if (keyCode === RIGHT_ARROW) {
        initialTailDirection = 'r';
      } else if (keyCode === DOWN_ARROW) {
        initialTailDirection = 'b';
      }
      firstKeyPress = false;
    }

    let previousDirection = currentHeadDirection;

    let hasTurned = false;
    let newX = posX;
    let newY = posY;
    let directionHead = currentHeadDirection;
    let directionBody = currentBodyDirection;
    for (let step = 0; step < resultadoDado; step++) {
      if (keyCode === LEFT_ARROW) {
        directionHead = 'l';
        directionBody = 'l';
        newX -= size;
      } else if (keyCode === RIGHT_ARROW) {
        directionHead = 'r';
        directionBody = 'r';
        newX += size;
      } else if (keyCode === UP_ARROW) {
        directionHead = 't';
        directionBody = 't';
        newY -= size;
      } else if (keyCode === DOWN_ARROW) {
        directionHead = 'b';
        directionBody = 'b';
        newY += size;
      } else {
        return;
      }

      if (dogTrail.some(sq => sq.x === newX && sq.y === newY)) {
        break;
      }

      if (
        newX >= 0 &&
        newY >= 0 &&
        newX < width &&
        newY < height &&
        !dogTrail.some(sq => sq.x === newX && sq.y === newY)
      ) {
        let cornerType = '';
        if (previousDirection !== directionHead && !hasTurned) {
          if (previousDirection === 'r' && directionHead === 'b') cornerType = '2';
          if (previousDirection === 'r' && directionHead === 't') cornerType = '3';
          if (previousDirection === 'l' && directionHead === 'b') cornerType = '1';
          if (previousDirection === 'l' && directionHead === 't') cornerType = '4';
          if (previousDirection === 't' && directionHead === 'r') cornerType = '1';
          if (previousDirection === 't' && directionHead === 'l') cornerType = '2';
          if (previousDirection === 'b' && directionHead === 'r') cornerType = '4';
          if (previousDirection === 'b' && directionHead === 'l') cornerType = '3';
          hasTurned = true;
        }

        currentHeadDirection = directionHead;
        console.log(posX, posY)
        console.log(newX, newY)
        dogTrail.push({ x: posX, y: posY, direction: directionBody, corner: cornerType });
        posX = newX;
        posY = newY;
      }
    }
  }

  hasTurned = false;

}

function drawSquares(array, r, g, b, alertedArray) {
  for (let i = 0; i < array.length; i++) {
    let { x, y } = array[i];
    fill(r, g, b, alertedArray[i] ? 64 : 255);
    rect(x + size / 4, y + size / 4, size / 2, size / 2);
  }
}

function checkSpecialSquares(array, alertedArray, action) {
  for (let i = 0; i < array.length; i++) {
    let square = array[i];
    if (posX === square.x && posY === square.y && !alertedArray[i]) {
      setTimeout(action, 100); 
      alertedArray[i] = true;
      break;
    }
  }
}

function retroceder(pasos) {
  let segmentBeforeCorner;

  for (let i = 0; i < pasos; i++) {
    if (dogTrail.length > 0) {
      let segment = dogTrail.pop();
      posX = segment.x; 
      posY = segment.y;
    } else {
      currentHeadDirection = initialTailDirection;
    }
  }

  let previousSegment = dogTrail[dogTrail.length - 1];

  if (previousSegment.corner) {
    background(0, 0, 255);
    segmentBeforeCorner = dogTrail[dogTrail.length - 2];
    if (previousSegment.corner === '1') {
      if (segmentBeforeCorner.direction === 't') {
        currentHeadDirection = 'r';
      } else if (segmentBeforeCorner.direction === 'l') {
        currentHeadDirection = 'b';
      }
    } else if (previousSegment.corner === '2') {
      if (segmentBeforeCorner.direction === 't') {
        currentHeadDirection = 'l';
      } else if (segmentBeforeCorner.direction === 'r') {
        currentHeadDirection = 'b';
      }
    } else if (previousSegment.corner === '3') {
      if (segmentBeforeCorner.direction === 'b') {
        currentHeadDirection = 'l';
      } else if (segmentBeforeCorner.direction === 'r') {
        currentHeadDirection = 't';
      }
    } else if (previousSegment.corner === '4') {
      if (segmentBeforeCorner.direction === 'b') {
        currentHeadDirection = 'r';
      } else if (segmentBeforeCorner.direction === 'l') {
        currentHeadDirection = 't';
      }
    }
  } else {
    background(0, 255, 0);
    if (previousSegment.direction === 'r') {
      currentHeadDirection = 'r';
    } else if (previousSegment.direction === 'l') {
      currentHeadDirection = 'l';
    } else if (previousSegment.direction === 't') {
      currentHeadDirection = 't';
    } else if (previousSegment.direction === 'b') {
      currentHeadDirection = 'b';
    }
  }
}