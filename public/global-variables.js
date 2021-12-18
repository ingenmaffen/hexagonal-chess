let selectedField = null;
let possibleActions = [];
let currentPlayer = "white";
let playerColor;
let check = false;
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
const defaultPawnPositionsAtGameInit = {
  white: ["b1", "c2", "d3", "e4", "f5", "g4", "h3", "i2", "k1"],
  black: ["b7", "c7", "d7", "e7", "f7", "g7", "h7", "i7", "k7"],
};
let gameState = {
  white: {},
  black: {},
};
