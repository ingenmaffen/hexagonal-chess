const socket = window.io();

// handle opponent move
socket.on("opponentMove", (event) => {
  selectedField = event.from;
  const piece = findClickedPiece(currentPlayer, selectedField);
  handleMove(to, piece, true);
});

socket.on("initialGameState", (initialGameState) => {
  loadGame(initialGameState);
});

socket.on("canUseName", () => {
  emptyMenu();
  appendMainMenu();
});

const sendMove = (from, to) => {
  socket.emit("playerMove", { from, to });
};

const loadGame = (loadedGameState) => {
  gameState = loadedGameState;
  drawBoard();
  drawGameState();
};

// socket.emit("loadGame");
