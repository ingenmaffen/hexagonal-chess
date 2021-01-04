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
