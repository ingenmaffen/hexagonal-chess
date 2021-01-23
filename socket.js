module.exports = {
  start: (http) => {
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
          const otherPlayerSocket = io.sockets.sockets[otherPlayerId];
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
      socket.on("getPlayerList", () => {
        const clients = [];
        for (const [key, value] of Object.entries(io.sockets.sockets)) {
          if (Object.keys(value.rooms).length < 2) {
            clients.push({
              playerId: key,
              playerName: users[key],
            });
          }
        }
        socket.emit("sendPlayerList", clients);
      });

      socket.on("sendRequestTo", (playerId) => {
        const requestedSocket = io.sockets.sockets[playerId];
        if (requestedSocket) {
          requestedSocket.emit("getRequestFrom", {
            playerId: socket.id,
            playerName: users[socket.id],
          });
        }
      });

      socket.on("acceptRequest", (playerId) => {
        const requestedSocket = io.sockets.sockets[playerId];
        if (requestedSocket) {
          const roomId = uuidv4();
          socket.join(roomId);
          requestedSocket.join(roomId);
          io.to(roomId).emit("loadGame", roomId);

          const room = require("./room").initRoom(roomId, requestedSocket.id, socket.id);
          requestedSocket.emit("initialCards", room.player1.hand);
          socket.emit("initialCards", room.player2.hand);
          rooms[roomId] = room;
        }
      });

      socket.on("cancelRequest", (playerId) => {
        // TODO: send info to player about cancelation
      });

      socket.on("exitRoom", (roomId) => {
        const room = rooms[roomId];
        const otherPlayerId = getOtherPlayerId(room, socket.id);
        const otherPlayerSocket = io.sockets.sockets[otherPlayerId];
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
          const otherPlayerSocket = io.sockets.sockets[otherPlayerId];
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
    if (value.player1.uuid === playerId || value.player2.uuid === playerId) {
      return key;
    }
  }
}
