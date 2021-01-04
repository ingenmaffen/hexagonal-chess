let selectedField = null;
let possibleActions = [];
let currentPlayer = "white";
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
