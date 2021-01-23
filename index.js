const path = require("path");
const express = require("express");
const timeout = require("connect-timeout");
const app = express();
const http = require("http").Server(app);
const initialGameState = require("./initial-game-state.json");

const socket = require("./socket");

app.use(timeout("5s"));
app.use("/public", (req, res) => {
  //   res.setHeader("Cache-Control", `max-age=${60 * 60 * 24}`);
  //   res.removeHeader("Pragma");
  //   res.removeHeader("Expires");
  res.sendFile(path.join(__dirname, req.originalUrl));
});
app.use(haltOnTimedout);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

socket.start(http, initialGameState);

// timeout handler middleware
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

// start server
http.listen(process.env.PORT || 3000, function () {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
