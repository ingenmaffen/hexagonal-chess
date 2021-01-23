module.exports = {
  start: (http, initialGameState) => {
    const { v4: uuidv4 } = require("uuid");
    const io = require("socket.io")(http, { cookie: false });
    const rooms = {};
    const users = {};
    io.on("connection", (socket) => {
      console.log(`${socket.id} connected`);

      socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        // TODO: a better option would be to reconnect the player
        const roomId = getRoomByPlayerId(socket.id, rooms);
        io.to(roomId).emit("opponentLeft");
        if (roomId) {
          const otherPlayerId = getOtherPlayerId(rooms[roomId], socket.id);
          const otherPlayerSocket = io.of("/").sockets.get(otherPlayerId);
          if (otherPlayerSocket) {
            otherPlayerSocket.leave(roomId);
          }
        }
        delete users[socket.id];
      });

      socket.on("username", (username) => {
        users[socket.id] = username;
        socket.emit("canUseName");
      });

      // events to handle request for matching up players
      socket.on("getPlayerList", async () => {
        const clients = [];
        const ids = await io.allSockets();
        for (const key of Array.from(ids)) {
          clients.push({
            playerId: key,
            playerName: users[key],
          });
        }
        // TODO: remove player from client list if they are in a room
        socket.emit("sendPlayerList", clients);
      });

      socket.on("sendRequestTo", (playerId) => {
        const requestedSocket = io.of("/").sockets.get(playerId);
        if (requestedSocket) {
          requestedSocket.emit("getRequestFrom", {
            playerId: socket.id,
            playerName: users[socket.id],
          });
        }
      });

      socket.on("acceptRequest", (playerId) => {
        const requestedSocket = io.of("/").sockets.get(playerId);
        if (requestedSocket) {
          const roomId = uuidv4();
          socket.join(roomId);
          requestedSocket.join(roomId);

          const room = {
            roomId,
            white: playerId,
            black: socket.id,
            gameState: initialGameState,
          };
          rooms[roomId] = room;
          io.to(roomId).emit("loadGame", room);
        }
      });

      socket.on("cancelRequest", (playerId) => {
        // TODO: send info to player about cancelation
      });

      socket.on("requestGameData", () => {
        socket.emit("initialGameState", initialGameState);
      });

      socket.on("playerMove", (move) => {
        const room = getRoomByPlayerId(socket.id, rooms);
        const otherPlayerId = room.white === socket.id ? room.black : room.white;
        const otherPlayerSocket = io.of("/").sockets.get(otherPlayerId);
        otherPlayerSocket.emit("opponentMove", move);
      });

      socket.on("exitRoom", (roomId) => {
        const room = rooms[roomId];
        const otherPlayerId = getOtherPlayerId(room, socket.id);
        const otherPlayerSocket = io.of("/").sockets.get(otherPlayerId);
        otherPlayerSocket.emit("opponentLeft");
        socket.leave(roomId);
        otherPlayerSocket.leave(roomId);
      });

      socket.on("returnToLobby", (roomId) => {
        const room = rooms[roomId];
        socket.leave(roomId, () => {});
        socket.emit("leaveRoom");
        if (room) {
          const otherPlayerId = getOtherPlayerId(room, socket.id);
          const otherPlayerSocket = io.of("/").sockets.get(otherPlayerId);
          otherPlayerSocket.leave(roomId);
        }
      });
    });
  },
};

function getOtherPlayerId(room, playerId) {
  let otherPlayerId = "";
  if (room.player1.uuid === playerId) {
    otherPlayerId = room.player2.uuid;
  } else {
    otherPlayerId = room.player1.uuid;
  }

  return otherPlayerId;
}

function getRoomByPlayerId(playerId, rooms) {
  for (let [key, value] of Object.entries(rooms)) {
    if (value.white === playerId || value.black === playerId) {
      return rooms[key];
    }
  }
}
