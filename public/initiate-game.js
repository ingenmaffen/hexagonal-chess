const loadGame = (loadedGameState) => {
  gameState = loadedGameState;
  defaultPawnPositions.white = [...defaultPawnPositionsAtGameInit.white];
  defaultPawnPositions.black = [...defaultPawnPositionsAtGameInit.black];
  drawBoard();
  drawGameState();
};

const initialGameState = {
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
