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
          handleMove(clickedField, key, !localPlay);
        }
      });
    }
  }
};

canvas.addEventListener("click", (event) => {
  if (localPlay || (playerColor && playerColor === currentPlayer)) {
    const canvasOffset = (window.innerWidth - (1080 * gameScale)) / 2; 
    const x = (event.layerX - canvasOffset) / gameScale;
    const y = event.layerY / gameScale;
    const offsetX = hexagonWidth * 1.8;
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
  }
});
