const fieldOrder = "abcdefghikl";
const defaultPawnPositions = {
  white: ["b1", "c2", "d3", "e4", "f5", "g4", "h3", "i2", "k1"],
  black: ["b7", "c7", "d7", "e7", "f7", "g7", "h7", "i7", "k7"],
};

const getPossibleMoves = (piece, clickedField) => {
  selectedField = clickedField;
  const numberRegex = /\d+/g;
  let fieldNumber = clickedField.match(numberRegex)[0];
  const fieldKey = clickedField.replace(fieldNumber, "");
  fieldNumber = +fieldNumber;
  const enemyPositions = getEnemyPositions();
  switch (piece) {
    case "pawn":
      if (currentPlayer === "white") {
        getWhitePawnMoves(fieldKey, fieldNumber, enemyPositions);
      }
      // if currentPlayer is black
      else {
        getBlackPawnMoves(fieldKey, fieldNumber, enemyPositions);
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
      if (piece === "pawn" && defaultPawnPositions[currentPlayer].length) {
        const playerPawnIndex = defaultPawnPositions[currentPlayer].indexOf(
          selectedField
        );
        if (playerPawnIndex !== -1) {
          defaultPawnPositions[currentPlayer].splice(playerPawnIndex, 1);
        }
      }
      const pieceIndex = gameState[currentPlayer][piece].indexOf(selectedField);
      const oppositePlayer = currentPlayer === "white" ? "black" : "white";
      gameState[currentPlayer][piece][pieceIndex] = actionField;

      // remove enemy piece
      const enemyPositions = getEnemyPositions();
      if (enemyPositions.find((pos) => pos === actionField)) {
        for (let [key, value] of Object.entries(gameState[oppositePlayer])) {
          if (value.find((piecePos) => piecePos === actionField)) {
            const index = gameState[oppositePlayer][key].indexOf(actionField);
            gameState[oppositePlayer][key].splice(index, 1);

            if (key === "pawn") {
              const pawnIndex = defaultPawnPositions[oppositePlayer].indexOf(
                actionField
              );
              if (index !== -1) {
                defaultPawnPositions[oppositePlayer].splice(pawnIndex, 1);
              }
            }
          }
        }
      }

      currentPlayer = oppositePlayer;
      possibleActions = [];
      selectedField = null;
      drawBoard();
      drawGameState();
    }
  }
};

const getEnemyPositions = () => {
  const enemyPositions = [];
  for (let [key, value] of Object.entries(
    gameState[currentPlayer === "white" ? "black" : "white"]
  )) {
    value.forEach((piece) => {
      enemyPositions.push(piece);
    });
  }
  return enemyPositions;
};

const getWhitePawnMoves = (fieldKey, fieldNumber, enemyPositions) => {
  const pawnInDefaultPosition = defaultPawnPositions[currentPlayer].indexOf(
    `${fieldKey}${fieldNumber}`
  );
  // vertical movement
  for (let i = 0; i < (pawnInDefaultPosition > -1 ? 2 : 1); i++) {
    if (fieldNumber + i + 1 <= fieldDefinition[fieldKey]) {
      if (enemyPositions.indexOf(`${fieldKey}${fieldNumber + i + 1}`) > 0) {
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
      fieldOrderIndex > 5 ? fieldNumber + 1 : fieldNumber
    }`;
    if (enemyPositions.find((field) => field === leftSideEnemyField)) {
      possibleActions.push(leftSideEnemyField);
    }
  }
};

const getBlackPawnMoves = (fieldKey, fieldNumber, enemyPositions) => {
  const pawnInDefaultPosition = defaultPawnPositions[currentPlayer].indexOf(
    `${fieldKey}${fieldNumber}`
  );
  // vertical movement
  for (let i = 0; i < (pawnInDefaultPosition > -1 ? 2 : 1); i++) {
    if (fieldNumber - (i + 1) > 0) {
      if (enemyPositions.indexOf(`${fieldKey}${fieldNumber - (i + 1)}`) > 0) {
        break;
      }
      possibleActions.push(`${fieldKey}${fieldNumber - (i + 1)}`);
    }
  }

  // diagonal movement (if has enemy)
  const fieldOrderIndex = fieldOrder.indexOf(fieldKey);
  // right side
  if (fieldOrderIndex + 1 < fieldOrder.length) {
    const rightSideEnemyField = `${fieldOrder[fieldOrderIndex + 1]}${
      fieldOrderIndex > 4 ? fieldNumber - 1 : fieldNumber
    }`;
    if (enemyPositions.find((field) => field === rightSideEnemyField)) {
      possibleActions.push(rightSideEnemyField);
    }
  }
  // left side
  if (fieldOrderIndex - 1 > 0) {
    const leftSideEnemyField = `${fieldOrder[fieldOrderIndex - 1]}${
      fieldOrderIndex > 5 ? fieldNumber : fieldNumber - 1
    }`;
    if (enemyPositions.find((field) => field === leftSideEnemyField)) {
      possibleActions.push(leftSideEnemyField);
    }
  }
};
