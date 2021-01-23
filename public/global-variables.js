let selectedField = null;
let localPlay = true;
let possibleActions = [];
let currentPlayer = "white";
let playerColor;
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
let gameState = {
  white: {},
  black: {},
};
