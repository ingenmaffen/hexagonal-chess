const fieldOrder = "abcdefghikl";
const defaultPawnPositions = {
  white: ["b1", "c2", "d3", "e4", "f5", "g4", "h3", "i2", "k1"],
  black: ["b7", "c7", "d7", "e7", "f7", "g7", "h7", "i7", "k7"],
};
const promotionFields = {
  white: ["a6", "b7", "c8", "d9", "e10", "f11", "g10", "h9", "i8", "k7", "l6"],
  black: ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", "i1", "k1", "l1"],
};

const getPossibleMoves = (piece, clickedField, shouldDrawField = true) => {
  selectedField = clickedField;
  const numberRegex = /\d+/g;
  let fieldNumber = clickedField.match(numberRegex)[0];
  const fieldKey = clickedField.replace(fieldNumber, "");
  fieldNumber = +fieldNumber;
  const enemyPositions = getEnemyPositions();
  const playerPositions = getPlayerPositions();
  switch (piece) {
    case "pawn":
      if (currentPlayer === "white") {
        getWhitePawnMoves(fieldKey, fieldNumber, enemyPositions, playerPositions);
      }
      // if currentPlayer is black
      else {
        getBlackPawnMoves(fieldKey, fieldNumber, enemyPositions, playerPositions);
      }
      break;
    case "bishop":
      getBishopMoves(fieldKey, fieldNumber, enemyPositions, playerPositions);
      break;
    case "rook":
      getRookMoves(fieldKey, fieldNumber, enemyPositions, playerPositions);
      break;
    case "knight":
      getKnightMoves(fieldKey, fieldNumber, playerPositions);
      break;
    case "queen":
      getBishopMoves(fieldKey, fieldNumber, enemyPositions, playerPositions);
      getRookMoves(fieldKey, fieldNumber, enemyPositions, playerPositions);
      break;
    case "king":
      getKingMoves(fieldKey, fieldNumber, enemyPositions, playerPositions);
      break;
  }
  if (shouldDrawField) {
    drawSelectedField();
  }
};

const handleMove = (clickedField, piece) => {
  if (selectedField === clickedField) {
    selectedField = null;
    drawBoard();
    drawGameState();
    possibleActions = [];
  } else {
    const actionField = possibleActions.find((action) => action === clickedField);
    if (actionField) {
      if (piece === "pawn" && defaultPawnPositions[currentPlayer].length) {
        const playerPawnIndex = defaultPawnPositions[currentPlayer].indexOf(selectedField);
        if (playerPawnIndex !== -1) {
          defaultPawnPositions[currentPlayer].splice(playerPawnIndex, 1);
        }
      }
      const pieceIndex = gameState[currentPlayer][piece].indexOf(selectedField);
      const oppositePlayer = currentPlayer === "white" ? "black" : "white";
      gameState[currentPlayer][piece][pieceIndex] = actionField;

      if (piece === "pawn" && promotionFields[currentPlayer].find((field) => field === actionField)) {
        appendPromotionWindow(currentPlayer, actionField);
      }

      // remove enemy piece
      const enemyPositions = getEnemyPositions();
      if (enemyPositions.find((pos) => pos === actionField)) {
        for (let [key, value] of Object.entries(gameState[oppositePlayer])) {
          if (value.find((piecePos) => piecePos === actionField)) {
            const index = gameState[oppositePlayer][key].indexOf(actionField);
            gameState[oppositePlayer][key].splice(index, 1);

            if (key === "pawn") {
              const pawnIndex = defaultPawnPositions[oppositePlayer].indexOf(actionField);
              if (index !== -1) {
                defaultPawnPositions[oppositePlayer].splice(pawnIndex, 1);
              }
            }
          }
        }
      }

      possibleActions = [];
      let possibleNextMoves = [];
      for (let [piece, value] of Object.entries(gameState[currentPlayer])) {
        value.forEach((field) => {
          getPossibleMoves(piece, field, false);
          possibleNextMoves = [...possibleNextMoves, ...possibleActions];
        });
      }
      currentPlayer = oppositePlayer;
      const isKingPossibleMove = possibleNextMoves.find((field) => field === gameState[currentPlayer].king[0]);
      if (isKingPossibleMove) {
        check = true;
      } else {
        check = false;
      }
      selectedField = null;
      possibleActions = [];
      drawBoard();
      drawGameState();
    }
  }
};

const appendPromotionWindow = (currentPlayer, actionField) => {
  const possiblePieces = ["bishop", "rook", "knight", "queen"];
  const promoWindow = document.getElementById("promotion-window");
  const buttonContainer = document.createElement("DIV");
  buttonContainer.classList = ["promotion-button-container"];
  possiblePieces.forEach((piece) => {
    const button = document.createElement("BUTTON");
    button.classList = ["promotion-button"];
    button.style.backgroundColor = dark ? "black" : "white";
    buttonContainer.appendChild(button);
    button.innerHTML = `<img width="32" height="32" src="public/assets/${piece}-${currentPlayer}.svg" />`;
    button.onclick = () => {
      promoWindow.removeChild(buttonContainer);
      const index = gameState[currentPlayer].pawn.indexOf(actionField);
      gameState[currentPlayer].pawn.splice(index, 1);
      gameState[currentPlayer][piece].push(actionField);
      drawBoard();
      drawGameState();
      promoWindow.style.display = "none";
    };
  });
  promoWindow.style.display = "block";
  promoWindow.appendChild(buttonContainer);
  buttonContainer.style.backgroundColor = dark ? "white" : "black";
};

const getEnemyPositions = () => {
  const enemyPositions = [];
  for (let [key, value] of Object.entries(gameState[currentPlayer === "white" ? "black" : "white"])) {
    value.forEach((piece) => {
      enemyPositions.push(piece);
    });
  }
  return enemyPositions;
};

const getPlayerPositions = () => {
  const playerPositions = [];
  for (let [key, value] of Object.entries(gameState[currentPlayer])) {
    value.forEach((piece) => {
      playerPositions.push(piece);
    });
  }
  return playerPositions;
};

const getWhitePawnMoves = (fieldKey, fieldNumber, enemyPositions, playerPositions) => {
  const pawnInDefaultPosition = defaultPawnPositions[currentPlayer].indexOf(`${fieldKey}${fieldNumber}`);
  // vertical movement
  for (let i = 0; i < (pawnInDefaultPosition > -1 ? 2 : 1); i++) {
    if (fieldNumber + i + 1 <= fieldDefinition[fieldKey]) {
      if (
        enemyPositions.indexOf(`${fieldKey}${fieldNumber + i + 1}`) > -1 ||
        playerPositions.indexOf(`${fieldKey}${fieldNumber + i + 1}`) > -1
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
    const rightSideEnemyField = `${fieldOrder[fieldOrderIndex + 1]}${fieldOrderIndex > 4 ? fieldNumber : fieldNumber + 1}`;
    if (enemyPositions.find((field) => field === rightSideEnemyField)) {
      possibleActions.push(rightSideEnemyField);
    }
  }
  // left side
  if (fieldOrderIndex - 1 > 0) {
    const leftSideEnemyField = `${fieldOrder[fieldOrderIndex - 1]}${fieldOrderIndex > 5 ? fieldNumber + 1 : fieldNumber}`;
    if (enemyPositions.find((field) => field === leftSideEnemyField)) {
      possibleActions.push(leftSideEnemyField);
    }
  }
};

const getBlackPawnMoves = (fieldKey, fieldNumber, enemyPositions, playerPositions) => {
  const pawnInDefaultPosition = defaultPawnPositions[currentPlayer].indexOf(`${fieldKey}${fieldNumber}`);
  // vertical movement
  for (let i = 0; i < (pawnInDefaultPosition > -1 ? 2 : 1); i++) {
    if (fieldNumber - (i + 1) > 0) {
      if (
        enemyPositions.indexOf(`${fieldKey}${fieldNumber - (i + 1)}`) > -1 ||
        playerPositions.indexOf(`${fieldKey}${fieldNumber - (i + 1)}`) > -1
      ) {
        break;
      }
      possibleActions.push(`${fieldKey}${fieldNumber - (i + 1)}`);
    }
  }

  // diagonal movement (if has enemy)
  const fieldOrderIndex = fieldOrder.indexOf(fieldKey);
  // right side
  if (fieldOrderIndex + 1 < fieldOrder.length) {
    const rightSideEnemyField = `${fieldOrder[fieldOrderIndex + 1]}${fieldOrderIndex > 4 ? fieldNumber - 1 : fieldNumber}`;
    if (enemyPositions.find((field) => field === rightSideEnemyField)) {
      possibleActions.push(rightSideEnemyField);
    }
  }
  // left side
  if (fieldOrderIndex - 1 > 0) {
    const leftSideEnemyField = `${fieldOrder[fieldOrderIndex - 1]}${fieldOrderIndex > 5 ? fieldNumber : fieldNumber - 1}`;
    if (enemyPositions.find((field) => field === leftSideEnemyField)) {
      possibleActions.push(leftSideEnemyField);
    }
  }
};

const hasEnemyOrPlayerPiece = (enemyOrPlayerPositions, fieldKey, fieldNumber) => {
  return enemyOrPlayerPositions.find((field) => field === `${fieldKey}${fieldNumber}`);
};

const getBishopMoves = (fieldKey, fieldNumber, enemyPositions, playerPositions) => {
  const startKeyIndex = fieldOrder.indexOf(fieldKey);

  // left
  for (let i = startKeyIndex - 1; i >= 0; i--) {
    if ((startKeyIndex - i) % 2 === 0) {
      const currentField =
        startKeyIndex <= 5
          ? fieldNumber + fieldDefinition[fieldOrder[i]] - fieldDefinition[fieldOrder[startKeyIndex]] + (startKeyIndex - i) / 2
          : i <= 5
          ? fieldNumber + fieldDefinition[fieldOrder[i]] - 11 + (startKeyIndex - i) / 2
          : fieldNumber + (startKeyIndex - i) / 2;

      if (fieldDefinition[fieldOrder[i]] >= currentField && currentField > 0) {
        if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentField)) {
          possibleActions.push(`${fieldOrder[i]}${currentField}`);
          break;
        } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentField)) {
          break;
        } else {
          possibleActions.push(`${fieldOrder[i]}${currentField}`);
        }
      }
    }
  }

  // right
  for (let i = startKeyIndex + 1; i < fieldOrder.length; i++) {
    if ((i - startKeyIndex) % 2 === 0) {
      const currentField =
        startKeyIndex > 5
          ? fieldNumber + fieldDefinition[fieldOrder[i]] - fieldDefinition[fieldOrder[startKeyIndex]] + (i - startKeyIndex) / 2
          : i <= 5
          ? fieldNumber + (i - startKeyIndex) / 2
          : fieldNumber + fieldDefinition[fieldOrder[i]] - 11 + (i - startKeyIndex) / 2;
      if (fieldDefinition[fieldOrder[i]] >= currentField && currentField > 0) {
        if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentField)) {
          possibleActions.push(`${fieldOrder[i]}${currentField}`);
          break;
        } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentField)) {
          break;
        } else {
          possibleActions.push(`${fieldOrder[i]}${currentField}`);
        }
      }
    }
  }

  // upper left
  let currentField = fieldNumber;
  for (let i = startKeyIndex - 1; i >= 0; i--) {
    currentField = i >= 5 ? currentField + 2 : currentField + 1;
    if (fieldDefinition[fieldOrder[i]] >= currentField) {
      if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentField)) {
        possibleActions.push(`${fieldOrder[i]}${currentField}`);
        break;
      } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentField)) {
        break;
      } else {
        possibleActions.push(`${fieldOrder[i]}${currentField}`);
      }
    }
  }

  // upper right
  currentField = fieldNumber;
  for (let i = startKeyIndex + 1; i < fieldOrder.length; i++) {
    currentField = i <= 5 ? currentField + 2 : currentField + 1;
    if (fieldDefinition[fieldOrder[i]] >= currentField) {
      if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentField)) {
        possibleActions.push(`${fieldOrder[i]}${currentField}`);
        break;
      } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentField)) {
        break;
      } else {
        possibleActions.push(`${fieldOrder[i]}${currentField}`);
      }
    }
  }

  // lower left
  currentField = fieldNumber;
  for (let i = startKeyIndex - 1; i >= 0; i--) {
    currentField = i < 5 ? currentField - 2 : currentField - 1;
    if (currentField > 0) {
      if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentField)) {
        possibleActions.push(`${fieldOrder[i]}${currentField}`);
        break;
      } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentField)) {
        break;
      } else {
        possibleActions.push(`${fieldOrder[i]}${currentField}`);
      }
    }
  }

  // lower right
  currentField = fieldNumber;
  for (let i = startKeyIndex + 1; i < fieldOrder.length; i++) {
    currentField = i > 5 ? currentField - 2 : currentField - 1;
    if (currentField > 0) {
      if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentField)) {
        possibleActions.push(`${fieldOrder[i]}${currentField}`);
        break;
      } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentField)) {
        break;
      } else {
        possibleActions.push(`${fieldOrder[i]}${currentField}`);
      }
    }
  }
};

// refactor maybe
const getRookMoves = (fieldKey, fieldNumber, enemyPositions, playerPositions) => {
  // up
  for (let i = fieldNumber + 1; i <= fieldDefinition[fieldKey]; i++) {
    const currentField = `${fieldKey}${i}`;
    if (hasEnemyOrPlayerPiece(enemyPositions, fieldKey, i)) {
      possibleActions.push(currentField);
      break;
    } else if (hasEnemyOrPlayerPiece(playerPositions, fieldKey, i)) {
      break;
    } else {
      possibleActions.push(currentField);
    }
  }

  // down
  for (let i = fieldNumber - 1; i > 0; i--) {
    const currentField = `${fieldKey}${i}`;
    if (hasEnemyOrPlayerPiece(enemyPositions, fieldKey, i)) {
      possibleActions.push(currentField);
      break;
    } else if (hasEnemyOrPlayerPiece(playerPositions, fieldKey, i)) {
      break;
    } else {
      possibleActions.push(currentField);
    }
  }

  const startKeyIndex = fieldOrder.indexOf(fieldKey);

  // upper left
  for (let i = fieldOrder.indexOf(fieldKey) - 1; i >= 0; i--) {
    const currentFieldNumber =
      i > 5
        ? fieldNumber + (fieldDefinition[fieldOrder[i]] - fieldDefinition[fieldOrder[startKeyIndex]])
        : startKeyIndex > 5
        ? fieldNumber + (11 - fieldDefinition[fieldOrder[startKeyIndex]])
        : fieldNumber;
    const upperCurrentField = `${fieldOrder[i]}${currentFieldNumber}`;
    if (hexagons[upperCurrentField]) {
      if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentFieldNumber)) {
        possibleActions.push(upperCurrentField);
        break;
      } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentFieldNumber)) {
        break;
      } else {
        possibleActions.push(upperCurrentField);
      }
    }
  }

  // lower left
  for (let i = fieldOrder.indexOf(fieldKey) - 1; i >= 0; i--) {
    const currentFieldNumber =
      i > 5
        ? fieldNumber
        : startKeyIndex < 5
        ? fieldNumber + (i - fieldOrder.indexOf(fieldKey))
        : fieldNumber - (11 - fieldDefinition[fieldOrder[i]]);
    const lowerCurrentField = `${fieldOrder[i]}${currentFieldNumber}`;
    if (hexagons[lowerCurrentField]) {
      if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentFieldNumber)) {
        possibleActions.push(lowerCurrentField);
        break;
      } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentFieldNumber)) {
        break;
      } else {
        possibleActions.push(lowerCurrentField);
      }
    }
  }

  // upper right
  for (let i = fieldOrder.indexOf(fieldKey) + 1; i < fieldOrder.length; i++) {
    const currentFieldNumber =
      i <= 5
        ? fieldNumber + (i - fieldOrder.indexOf(fieldKey))
        : startKeyIndex > 5
        ? fieldNumber
        : fieldNumber + (11 - fieldDefinition[fieldOrder[startKeyIndex]]);
    const upperCurrentField = `${fieldOrder[i]}${currentFieldNumber}`;
    if (hexagons[upperCurrentField]) {
      if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentFieldNumber)) {
        possibleActions.push(upperCurrentField);
        break;
      } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentFieldNumber)) {
        break;
      } else {
        possibleActions.push(upperCurrentField);
      }
    }
  }

  // lower right
  for (let i = fieldOrder.indexOf(fieldKey) + 1; i < fieldOrder.length; i++) {
    const currentFieldNumber =
      i < 5
        ? fieldNumber
        : startKeyIndex > 5
        ? fieldNumber - (i - fieldOrder.indexOf(fieldKey))
        : fieldNumber - (11 - fieldDefinition[fieldOrder[i]]);
    const lowerCurrentField = `${fieldOrder[i]}${currentFieldNumber}`;
    if (hexagons[lowerCurrentField]) {
      if (hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[i], currentFieldNumber)) {
        possibleActions.push(lowerCurrentField);
        break;
      } else if (hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentFieldNumber)) {
        break;
      } else {
        possibleActions.push(lowerCurrentField);
      }
    }
  }
};

const getKnightMoves = (fieldKey, fieldNumber, playerPositions) => {
  const startKeyIndex = fieldOrder.indexOf(fieldKey);

  // left
  for (let i = startKeyIndex - 1; i >= 0 && startKeyIndex - i <= 3; i--) {
    let currentUpperField;
    let currentLowerField;
    switch (startKeyIndex - i) {
      case 1:
        currentUpperField = i >= 5 ? fieldNumber + 3 : fieldNumber + 2;
        currentLowerField = i < 5 ? fieldNumber - 3 : fieldNumber - 2;
        break;
      case 2:
        currentUpperField = startKeyIndex <= 5 ? fieldNumber + 1 : startKeyIndex <= 6 ? fieldNumber + 2 : fieldNumber + 3;
        currentLowerField = startKeyIndex > 6 ? fieldNumber - 1 : startKeyIndex > 5 ? fieldNumber - 2 : fieldNumber - 3;
        break;
      case 3:
        currentUpperField =
          startKeyIndex > 7
            ? fieldNumber + 2
            : startKeyIndex === 7
            ? fieldNumber + 1
            : startKeyIndex === 6
            ? fieldNumber
            : fieldNumber - 1;
        currentLowerField = currentUpperField - 1;
        break;
    }
    if (
      currentUpperField > 0 &&
      fieldDefinition[fieldOrder[i]] >= currentUpperField &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentUpperField)
    ) {
      possibleActions.push(`${fieldOrder[i]}${currentUpperField}`);
    }
    if (
      currentLowerField > 0 &&
      fieldDefinition[fieldOrder[i]] >= currentLowerField &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentLowerField)
    ) {
      possibleActions.push(`${fieldOrder[i]}${currentLowerField}`);
    }
  }

  // right
  for (let i = startKeyIndex + 1; i < fieldOrder.length && i - startKeyIndex <= 3; i++) {
    let currentUpperField;
    let currentLowerField;
    switch (i - startKeyIndex) {
      case 1:
        currentUpperField = i <= 5 ? fieldNumber + 3 : fieldNumber + 2;
        currentLowerField = i > 5 ? fieldNumber - 3 : fieldNumber - 2;
        break;
      case 2:
        currentUpperField = startKeyIndex < 4 ? fieldNumber + 3 : startKeyIndex === 4 ? fieldNumber + 2 : fieldNumber + 1;
        currentLowerField = startKeyIndex < 4 ? fieldNumber - 1 : startKeyIndex === 4 ? fieldNumber - 2 : fieldNumber - 3;
        break;
      case 3:
        currentUpperField =
          startKeyIndex < 3
            ? fieldNumber + 2
            : startKeyIndex === 3
            ? fieldNumber + 1
            : startKeyIndex === 4
            ? fieldNumber
            : fieldNumber - 1;
        currentLowerField = currentUpperField - 1;
        break;
    }

    if (
      currentUpperField > 0 &&
      fieldDefinition[fieldOrder[i]] >= currentUpperField &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentUpperField)
    ) {
      possibleActions.push(`${fieldOrder[i]}${currentUpperField}`);
    }
    if (
      currentLowerField > 0 &&
      fieldDefinition[fieldOrder[i]] >= currentLowerField &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[i], currentLowerField)
    ) {
      possibleActions.push(`${fieldOrder[i]}${currentLowerField}`);
    }
  }
};

const getKingMoves = (fieldKey, fieldNumber, enemyPositions, playerPositions) => {
  const startKeyIndex = fieldOrder.indexOf(fieldKey);

  const topLeftNumber = startKeyIndex > 5 ? fieldNumber + 1 : fieldNumber;
  const topRightNumber = startKeyIndex < 5 ? fieldNumber + 1 : fieldNumber;

  // 1 distance moves
  const oneDistanceMoveFields = {
    up:
      fieldDefinition[fieldKey] >= fieldNumber + 1 &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex], fieldNumber + 1)
        ? `${fieldKey}${fieldNumber + 1}`
        : null,
    upLeft:
      startKeyIndex - 1 >= 0 &&
      fieldDefinition[fieldOrder[startKeyIndex - 1]] >= topLeftNumber &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 1], topLeftNumber)
        ? `${fieldOrder[startKeyIndex - 1]}${topLeftNumber}`
        : null,
    downLeft:
      startKeyIndex - 1 >= 0 &&
      topLeftNumber - 1 > 0 &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 1], topLeftNumber - 1)
        ? `${fieldOrder[startKeyIndex - 1]}${topLeftNumber - 1}`
        : null,
    down:
      fieldNumber - 1 > 0 && !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex], fieldNumber - 1)
        ? `${fieldKey}${fieldNumber - 1}`
        : null,
    downRight:
      startKeyIndex + 1 < fieldOrder.length &&
      topRightNumber - 1 > 0 &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 1], topRightNumber - 1)
        ? `${fieldOrder[startKeyIndex + 1]}${topRightNumber - 1}`
        : null,
    upRight:
      startKeyIndex + 1 < fieldOrder.length &&
      fieldDefinition[fieldOrder[startKeyIndex + 1]] >= topRightNumber &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 1], topRightNumber)
        ? `${fieldOrder[startKeyIndex + 1]}${topRightNumber}`
        : null,
  };

  for (const [key, value] of Object.entries(oneDistanceMoveFields)) {
    if (value) {
      possibleActions.push(value);
    }
  }

  // 2 distance moves
  if (
    (oneDistanceMoveFields.up &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldKey, fieldNumber + 1) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldKey, fieldNumber + 1)) ||
    (oneDistanceMoveFields.upLeft &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[startKeyIndex - 1], topLeftNumber) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 1], topLeftNumber))
  ) {
    if (
      fieldDefinition[fieldOrder[startKeyIndex - 1]] >= topLeftNumber + 1 &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 1], topLeftNumber + 1)
    ) {
      possibleActions.push(`${fieldOrder[startKeyIndex - 1]}${topLeftNumber + 1}`);
    }
  }

  if (
    (oneDistanceMoveFields.downLeft &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[startKeyIndex - 1], topLeftNumber - 1) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 1], topLeftNumber - 1)) ||
    (oneDistanceMoveFields.upLeft &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[startKeyIndex - 1], topLeftNumber) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 1], topLeftNumber))
  ) {
    const leftFieldNumber = startKeyIndex - 1 > 5 ? topLeftNumber : topLeftNumber - 1;
    if (
      startKeyIndex - 2 >= 0 &&
      fieldDefinition[fieldOrder[startKeyIndex - 2]] >= leftFieldNumber &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 2], leftFieldNumber)
    ) {
      possibleActions.push(`${fieldOrder[startKeyIndex - 2]}${leftFieldNumber}`);
    }
  }
  if (
    (oneDistanceMoveFields.downLeft &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[startKeyIndex - 1], topLeftNumber - 1) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 1], topLeftNumber - 1)) ||
    (oneDistanceMoveFields.down &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldKey, fieldNumber - 1) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldKey, fieldNumber - 1))
  ) {
    if (topLeftNumber - 2 > 0 && !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex - 1], topLeftNumber - 2)) {
      possibleActions.push(`${fieldOrder[startKeyIndex - 1]}${topLeftNumber - 2}`);
    }
  }

  if (
    (oneDistanceMoveFields.downRight &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[startKeyIndex + 1], topRightNumber - 1) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 1], topRightNumber - 1)) ||
    (oneDistanceMoveFields.down &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldKey, fieldNumber - 1) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldKey, fieldNumber - 1))
  ) {
    if (topRightNumber - 2 > 0 && !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 1], topRightNumber - 2)) {
      possibleActions.push(`${fieldOrder[startKeyIndex + 1]}${topRightNumber - 2}`);
    }
  }

  if (
    (oneDistanceMoveFields.downRight &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[startKeyIndex + 1], topRightNumber - 1) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 1], topRightNumber - 1)) ||
    (oneDistanceMoveFields.upRight &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[startKeyIndex + 1], topRightNumber) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 1], topRightNumber))
  ) {
    const rightFieldNumber = startKeyIndex + 1 >= 5 ? topRightNumber - 1 : topRightNumber;
    if (
      startKeyIndex + 2 < fieldOrder.length &&
      topRightNumber + 2 <= fieldDefinition[fieldOrder[startKeyIndex + 2]] &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 2], rightFieldNumber)
    ) {
      possibleActions.push(`${fieldOrder[startKeyIndex + 2]}${rightFieldNumber}`);
    }
  }

  if (
    (oneDistanceMoveFields.up &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldKey, fieldNumber + 1) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldKey, fieldNumber + 1)) ||
    (oneDistanceMoveFields.upRight &&
      !hasEnemyOrPlayerPiece(enemyPositions, fieldOrder[startKeyIndex + 1], topRightNumber) &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 1], topRightNumber))
  ) {
    if (
      fieldDefinition[fieldOrder[startKeyIndex + 1]] >= topRightNumber + 1 &&
      !hasEnemyOrPlayerPiece(playerPositions, fieldOrder[startKeyIndex + 1], topRightNumber + 1)
    ) {
      possibleActions.push(`${fieldOrder[startKeyIndex + 1]}${topRightNumber + 1}`);
    }
  }
};
