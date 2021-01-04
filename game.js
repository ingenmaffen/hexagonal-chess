// initiate canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;
window.addEventListener("resize", (_event) => {
  canvas.style.width = window.innerHeight;
  canvas.style.height = window.innerHeight;
  gameScale = window.innerHeight / 1080;
});

// variable definitions
let selectedField = null;
let possibleActions = [];
let currentPlayer = "white";
const pieceTypes = ["pawn", "bishop", "rook", "knight", "queen", "king"];
let gameScale = window.innerHeight / 1080;
const scale = 50;
const hexagonHeight = scale * Math.cos(Math.PI / 6) * 2;
const hexagonWidth = 1.5 * scale;
const hexagons = {};
const fieldDefinition = {
  a: 6,
  b: 7,
  c: 8,
  d: 9,
  e: 10,
  f: 11,
  g: 10,
  h: 9,
  i: 8,
  k: 7,
  l: 6,
};
const gameState = {
  white: {
    pawn: ["b1", "c2", "d3", "e4", "f5", "g4", "h3", "i2", "k1"],
    bishop: ["f1", "f2", "f3"],
    rook: ["c1", "i1"],
    knight: ["d1", "h1"],
    queen: ["e1"],
    king: ["g1"],
  },
  black: {
    pawn: ["b7", "c7", "d7", "e7", "f7", "g7", "h7", "i7", "k7"],
    bishop: ["f11", "f10", "f9"],
    rook: ["c8", "i8"],
    knight: ["d9", "h9"],
    queen: ["e10"],
    king: ["g10"],
  },
};

// drawing methods
const drawHexagon = (relativeX = 0, relativeY = 0, color = "#ff0000") => {
  ctx.fillStyle = color;
  relativeX += hexagonWidth / 2;
  relativeY += hexagonHeight / 2;
  ctx.beginPath();
  ctx.moveTo(relativeX + 0, relativeY + 0);
  ctx.lineTo(relativeX + 1 * scale, relativeY + 0);
  ctx.lineTo(relativeX + 1.5 * scale, relativeY + hexagonHeight / 2);
  ctx.lineTo(relativeX + 1 * scale, relativeY + hexagonHeight);
  ctx.lineTo(relativeX + 0, relativeY + hexagonHeight);
  ctx.lineTo(relativeX - 0.5 * scale, relativeY + hexagonHeight / 2);
  ctx.closePath();
  ctx.fill();
};

const drawBoard = () => {
  const colorsLight = ["#D28C45", "#E9AD70", "#FFCF9F"];
  const colorsDark = ["#001540", "#001C57", "#00316E"];
  const colors = dark ? colorsDark : colorsLight;
  let keyIndex = 0;
  for (const [key, value] of Object.entries(fieldDefinition)) {
    for (let i = 0; i < value; i++) {
      hexagons[`${key}${i + 1}`] = {
        x: keyIndex * hexagonWidth,
        y: (4.5 + value * 0.5 - i) * hexagonHeight,
        color: colors[(i + value) % 3],
      };
    }
    keyIndex++;
  }

  for (const [key, value] of Object.entries(hexagons)) {
    drawHexagon(value.x, value.y, value.color);
  }
};

const drawGameState = () => {
  for (const [key, value] of Object.entries(gameState.white)) {
    value.forEach((field) => {
      const img = new Image();
      img.src = `./assets/${key}-white.svg`;
      img.onload = () => {
        ctx.drawImage(
          img,
          hexagons[field].x + hexagonWidth * 0.45,
          hexagons[field].y + hexagonHeight * 0.65,
          hexagonWidth * 0.75,
          hexagonHeight * 0.75
        );
      };
    });
  }

  for (const [key, value] of Object.entries(gameState.black)) {
    value.forEach((field) => {
      const img = new Image();
      img.src = `./assets/${key}-black.svg`;
      img.onload = () => {
        ctx.drawImage(
          img,
          hexagons[field].x + hexagonWidth * 0.45,
          hexagons[field].y + hexagonHeight * 0.65,
          hexagonWidth * 0.75,
          hexagonHeight * 0.75
        );
      };
    });
  }
};

// dark/light mode
let dark = localStorage.getItem("darkMode");
dark = dark && dark === "true";
if (dark) {
  document.body.style.backgroundColor = "black";
}

const appendDarkLightButton = () => {
  const button = document.createElement("BUTTON");
  button.innerHTML = `<img width="32" height="32" src="assets/${
    dark ? "sun" : "moon"
  }.svg" />`;
  button.style.marginRight = 10;
  button.style.marginTop = 10;
  button.style.backgroundColor = "transparent";
  button.style.border = "none";
  button.onclick = () => {
    switchDarkLightMode();
    document.getElementById("button-container").removeChild(button);
    appendDarkLightButton();
  };
  document.getElementById("button-container").append(button);
};

const switchDarkLightMode = () => {
  dark = !dark;
  if (dark) {
    document.body.style.backgroundColor = "black";
  } else {
    document.body.style.backgroundColor = "white";
  }
  localStorage.setItem("darkMode", dark);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGameState();
  drawBoard();
  if (selectedField) {
    drawSelectedField();
  }
};

// handle game events
const drawSelectedField = () => {
  const selectedHexagon = hexagons[selectedField];
  drawHexagon(selectedHexagon.x, selectedHexagon.y, "#296600");
  drawGameState();
  possibleActions.forEach((actionField) => {
    const possibleActionHexagon = hexagons[actionField];
    drawHexagon(possibleActionHexagon.x, possibleActionHexagon.y, "#BA110C");
    drawGameState();
  });
};

const getPossibleMoves = (piece, clickedField) => {
  selectedField = clickedField;
  const numberRegex = /\d+/g;
  let fieldNumber = clickedField.match(numberRegex)[0];
  const fieldKey = clickedField.replace(fieldNumber, "");
  fieldNumber = +fieldNumber;
  const fieldOrder = "abcdefghikl";
  const enemyPositions = [];
  for (let [key, value] of Object.entries(
    gameState[currentPlayer === "white" ? "black" : "white"]
  )) {
    value.forEach((piece) => {
      enemyPositions.push(piece);
    });
  }
  switch (piece) {
    case "pawn":
      if (currentPlayer === "white") {
        // vertical movement
        // TODO: only move to if it is that pawns first move, implementation idea:
        // array with inital pawn positions, on move remove pawn from array
        for (let i = 0; i < 2; i++) {
          if (fieldNumber + i + 1 <= fieldDefinition[fieldKey]) {
            if (
              enemyPositions.indexOf(`${fieldKey}${fieldNumber + i + 1}`) > 0
            ) {
              break;
            }
            possibleActions.push(`${fieldKey}${fieldNumber + i + 1}`);
          }
        }
        // diagonal movement (if has enemy)
        const fieldOrderIndex = fieldOrder.indexOf(fieldKey);
        // right side
        if (fieldOrderIndex + 1 < fieldOrder.length) {
          const rightSideEnemyField = `${fieldOrder[fieldOrderIndex + 1]}${
            fieldOrderIndex > 4 ? fieldNumber : fieldNumber + 1
          }`;
          if (enemyPositions.find((field) => field === rightSideEnemyField)) {
            possibleActions.push(rightSideEnemyField);
          }
        }
        // left side
        if (fieldOrderIndex - 1 > 0) {
          const leftSideEnemyField = `${fieldOrder[fieldOrderIndex - 1]}${
            fieldOrderIndex > 4 ? fieldNumber + 1 : fieldNumber
          }`;
          if (enemyPositions.find((field) => field === leftSideEnemyField)) {
            possibleActions.push(leftSideEnemyField);
          }
        }
      }
      // if currentPlayer is black
      else {
        // TODO
      }
      break;
    case "bishop":
      // TODO
      break;
    case "rook":
      // TODO
      break;
    case "knight":
      // TODO
      break;
    case "queen":
      // TODO
      break;
    case "king":
      // TODO
      break;
  }
  drawSelectedField();
};

const handleMove = (clickedField, piece) => {
  if (selectedField === clickedField) {
    selectedField = null;
    drawBoard();
    drawGameState();
    possibleActions = [];
  } else {
    const actionField = possibleActions.find(
      (action) => action === clickedField
    );
    if (actionField) {
      // TODO: if selected piece is pawn and actionField is the opposite end of the board, append promotion dialog
      const pieceIndex = gameState[currentPlayer][piece].indexOf(selectedField);
      const oppositePlayer = currentPlayer === "white" ? "black" : "white";
      gameState[currentPlayer][piece][pieceIndex] = actionField;
      // TODO: if selected field has enemy, remove it
      currentPlayer = oppositePlayer;
      possibleActions = [];
      drawBoard();
      drawGameState();
    }
  }
};

const findClickedPiece = (player, clickedField) => {
  if (!selectedField) {
    for (const [key, value] of Object.entries(gameState[player])) {
      value.forEach((field) => {
        if (field === clickedField) {
          getPossibleMoves(key, clickedField);
        }
      });
    }
  } else {
    for (const [key, value] of Object.entries(gameState[player])) {
      value.forEach((field) => {
        if (field === selectedField) {
          handleMove(clickedField, key);
        }
      });
    }
  }
};

canvas.addEventListener("click", (event) => {
  const x = event.layerX / gameScale;
  const y = event.layerY / gameScale;
  const offsetX = hexagonWidth / 2;
  const offsetY = hexagonHeight / 2;
  const clickedField = [];
  for (const [key, value] of Object.entries(hexagons)) {
    if (
      value.x + offsetX < x &&
      value.y + offsetY < y &&
      value.x + offsetX + hexagonWidth - scale / 2 > x &&
      value.y + offsetY + hexagonHeight > y
    ) {
      clickedField.push(key);
    }
  }
  if (clickedField.length === 1) {
    findClickedPiece(currentPlayer, clickedField[0]);
  }
});

// initiate game
drawBoard();
drawGameState();
appendDarkLightButton();
