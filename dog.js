let firstKeyPress = true;
let dadoLanzado = false;
let direccionElegida = false;
let resultadoDado = 0;
let posX = 0;
let posY = 0;
let initialPosX;
let initialPosY;
let size = 40;
let rollbackCount = 3;
let dogTrail = [];
let totalOfRedSquares = 2;
let totalOfBlueSquares = 6;
let totalOfGreenSquares = 4;
let redSquares = [];
let blueSquares = [];
let greenSquares = [];
let yellowSquare;
let chocolateImage;

let headImgs = {};
let bodyImgs = {};
let tailImgs = {};
let cornerImgs = {};

let alertedRed = new Array(totalOfRedSquares).fill(false);
let alertedBlue = new Array(totalOfBlueSquares).fill(false);
let alertedGreen = new Array(totalOfGreenSquares).fill(false);

function preload() {
  headImgs['r'] = loadImage('assets/head-r.svg');
  headImgs['b'] = loadImage('assets/head-b.svg');
  headImgs['l'] = loadImage('assets/head-l.svg');
  headImgs['t'] = loadImage('assets/head-t.svg');
  bodyImgs['r'] = bodyImgs['l'] = loadImage('assets/body-x.svg');
  bodyImgs['t'] = bodyImgs['b'] = loadImage('assets/body-y.svg');
  tailImgs['r'] = loadImage('assets/tail-r.svg');
  tailImgs['b'] = loadImage('assets/tail-b.svg');
  cornerImgs['1'] = loadImage('assets/corner-1.svg');
  cornerImgs['2'] = loadImage('assets/corner-2.svg');
  cornerImgs['3'] = loadImage('assets/corner-3.svg');
  cornerImgs['4'] = loadImage('assets/corner-4.svg');
  chocolateImage = loadImage('assets/chocolate.svg');
  uvaImage = loadImage('assets/uva.svg');
  cardImage = loadImage('assets/tarjeta-premios.svg');
  sujetoImage = loadImage('assets/sujeto.svg');
}

let currentHeadDirection = 'r';
let currentBodyDirection = 'r';
let initialTailDirection = 'r';

function setup() {
  createCanvas(size * 10, size * 10);
  background(200);
  drawGrid();

  console.log(chocolateImage);
  
  drawRandomSquares(totalOfRedSquares, redSquares, chocolateImage); // Rojo
  drawRandomSquares(totalOfBlueSquares, blueSquares, uvaImage); // Azul
  drawRandomSquares(totalOfGreenSquares, greenSquares, cardImage); // Verde
  initialPosX = 0;
  initialPosY = 0;
  image(headImgs[currentHeadDirection], initialPosX, initialPosY, size, size);
  image(tailImgs[initialTailDirection], initialPosX, initialPosY, size, size);

  do {
    gridX = int(random(width / size));
    gridY = int(random(height / size));
    x = gridX * size;
    y = gridY * size;
  } while (isSquareOccupied(x, y) || (gridX === 0 && gridY === 0));

  yellowSquare = { x: x, y: y };
  fill(255, 255, 0);
  image(sujetoImage, x, y, size, size);
}

function drawGrid() {
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      stroke(121, 163, 118);
      strokeWeight(1);
      line(x, 0, x, height);
      line(0, y, width, y);
    }
  }
}

function drawRandomSquares(count, array, imagesvg) {
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
    } while (isSquareOccupied(x, y) || (gridX === 0 && gridY === 0));

    array.push({ x: x, y: y });
    image(imagesvg, x, y, size, size);
  }
}

function isSquareOccupied(x, y) {
  for (const square of redSquares) {
    if (square.x === x && square.y === y) return true;
  }
  for (const square of blueSquares) {
    if (square.x === x && square.y === y) return true;
  }
  for (const square of greenSquares) {
    if (square.x === x && square.y === y) return true;
  }
  if (yellowSquare && yellowSquare.x === x && yellowSquare.y === y) return true;

  return false;
}

function draw() {
  background(190, 247, 171);
  drawGrid();

  drawSquares(redSquares, alertedRed, chocolateImage);
  drawSquares(blueSquares,alertedBlue, uvaImage);
  drawSquares(greenSquares, alertedGreen, cardImage);
  fill(255, 255, 0);
  image(sujetoImage, yellowSquare.x, yellowSquare.y, size, size);

  if (dogTrail.length > 0) {
    image(tailImgs[initialTailDirection], dogTrail[0].x, dogTrail[0].y, size, size);
  }

  for (let i = 1; i < dogTrail.length; i++) {
    let segment = dogTrail[i];
    if (segment.corner) {
      image(cornerImgs[segment.corner], segment.x, segment.y, size, size);
    } else if (segment.direction) {
      image(bodyImgs[segment.direction], segment.x, segment.y, size, size);
    } 

    if (segment.x === yellowSquare.x && segment.y === yellowSquare.y){
      noLoop();
      setTimeout(() => {
        alert("¡Perdiste! No encontraste a tu humano");
        location.reload();
      }, 100);
    }
  }

  image(headImgs[currentHeadDirection], posX, posY, size, size);

  checkSpecialSquares(redSquares, alertedRed, () => {
    alert("¡Perdiste!");
    location.reload();
  });

  checkSpecialSquares(blueSquares, alertedBlue, () => {
    retroceder(rollbackCount);
  });

  checkSpecialSquares(greenSquares, alertedGreen, () => {
    alert("Esta es la personalidad de tu dueño");
  });

  if (posX === yellowSquare.x && posY === yellowSquare.y) {
    noLoop();
    setTimeout(() => {
      alert("¡Ganaste!");
      location.reload();
    }, 100);
  } 
}

function activarMovimiento(dado) {
  if (!dadoLanzado) {
    resultadoDado = dado;
    dadoLanzado = true;
    direccionElegida = false;
    habilitarBotonLanzarDado(false);
  } else {
    console.log("Ya se lanzó el dado, elige la dirección.");
    habilitarBotonesDireccion(true);
  }
}

function lanzarDado() {
  resultadoDado = Math.floor(Math.random() * 6) + 1; // Lanzamiento de un dado de 6 caras
  document.getElementById("resultado").innerText = "Resultado del dado: " + resultadoDado;
  dadoLanzado = true;
  direccionElegida = false;
  habilitarBotonLanzarDado(false);
  habilitarBotonesDireccion(true);
}

function mover(direccion) {
  if (dadoLanzado && direccionElegida) {
    console.log(dadoLanzado, direccionElegida);
    keyPressed(direccion);
    direccionElegida = false;
    dadoLanzado = false; // Se reinicia después de mover
    habilitarBotonesDireccion(false);
    habilitarBotonLanzarDado(true);
  }
}

function moverDerecha() {
  if (dadoLanzado && !direccionElegida) {
    console.log(dadoLanzado, direccionElegida)
    direccionElegida = true;
    mover(RIGHT_ARROW)
  }
}

function moverIzquierda() {
  if (dadoLanzado && !direccionElegida) {
    console.log(dadoLanzado, direccionElegida)
    direccionElegida = true;
    mover(LEFT_ARROW)
  }
}

function moverArriba() {
  if (dadoLanzado && !direccionElegida) {
    console.log(dadoLanzado, direccionElegida)
    direccionElegida = true;
    mover(UP_ARROW)
  }
}

function moverAbajo() {
  if (dadoLanzado && !direccionElegida) {
    console.log(dadoLanzado, direccionElegida)
    direccionElegida = true;
    mover(DOWN_ARROW)
  }
}

function habilitarBotonesDireccion(habilitar) {
  const botonesDireccion = document.querySelectorAll("#flechas button");
  botonesDireccion.forEach(button => {
    button.disabled = !habilitar;
  });
}

function habilitarBotonLanzarDado(habilitar) {
  const botonLanzarDado = document.getElementById("btnLanzarDado");
  botonLanzarDado.disabled = !habilitar;
}

habilitarBotonesDireccion(false);


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

function drawSquares(array, alertedArray, imagesvg) {
  for (let i = 0; i < array.length; i++) {
    let { x, y } = array[i];
    image(imagesvg, x , y, size, size); // Dibujamos la imagen
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
  if (dogTrail.length <= pasos) {
    posX = initialPosX;
    posY = initialPosY;
    currentHeadDirection = initialTailDirection;
    initialTailDirection = 'r'; 
    dogTrail = [];
    return;
  }

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