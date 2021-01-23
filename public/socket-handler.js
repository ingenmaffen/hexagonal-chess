const socket = window.io();
let roomId;

// handle opponent move
socket.on("opponentMove", (event) => {
  selectedField = event.from;
  for (const [key, value] of Object.entries(gameState[currentPlayer])) {
    value.forEach((field) => {
      if (field === selectedField) {
        piece = key;
      }
    });
  }
  possibleActions.push(event.to);
  handleMove(event.to, piece, false);
});

socket.on("initialGameState", (initialGameState) => {
  loadGame(initialGameState);
});

socket.on("loadGame", (room) => {
  roomId = room.roomId;
  playerColor = room.white === socket.id ? "white" : "black";
  localPlay = false;
  hideMenu();
  gameState = room.gameState;
  drawBoard();
  drawGameState();
});

socket.on("canUseName", () => {
  emptyMenu();
  appendMainMenu();
});

socket.on("sendPlayerList", (playerList) => {
  emptyMenu();
  appendPlayerListMenu();
  const otherPlayers = playerList.filter((item) => item.playerId !== socket.id);
  otherPlayers.forEach((player) => {
    listPlayersClickable(player.playerName, () => {
      socket.emit("sendRequestTo", player.playerId);
    });
  });
});

socket.on("getRequestFrom", ({ playerId, playerName }) => {
  appendGameRequest(playerId, playerName);
});

socket.on("opponentLeft", () => {
  $("#end-game-box").css("display", "block");
  $("#end-game-box").append("<p>Your opponent left!</p>");
  appendLeaveRoomButton();
});

const sendMove = (from, to) => {
  socket.emit("playerMove", { from, to });
};

const loadGame = (loadedGameState) => {
  gameState = loadedGameState;
  drawBoard();
  drawGameState();
};
