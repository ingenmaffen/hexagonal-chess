// drawing methods
const drawHexagon = (relativeX = 0, relativeY = 0, color = "#ff0000") => {
  ctx.fillStyle = color;
  relativeX += hexagonWidth * 1.85;
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
  $("#game-status-container").empty();
  if (playerColor) {
    $("#game-status-container").append(`<p>You play as ${playerColor}</p><p>It's ${currentPlayer}'s turn</p>`);
  }
  if (localPlay) {
    $("#game-status-container").append(`<p>It's ${currentPlayer}'s turn</p>`);
  }
  for (const [key, value] of Object.entries(gameState.white)) {
    value.forEach((field) => {
      const img = new Image();
      img.src = `./public/assets/${key}-white.svg`;
      img.onload = () => {
        ctx.drawImage(
          img,
          hexagons[field].x + hexagonWidth * 1.8,
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
      img.src = `./public/assets/${key}-black.svg`;
      img.onload = () => {
        ctx.drawImage(
          img,
          hexagons[field].x + hexagonWidth * 1.8,
          hexagons[field].y + hexagonHeight * 0.65,
          hexagonWidth * 0.75,
          hexagonHeight * 0.75
        );
      };
    });
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
