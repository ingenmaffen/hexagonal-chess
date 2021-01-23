const path = require("path");
const express = require("express");
const timeout = require("connect-timeout");
const app = express();
const http = require("http").Server(app);

const socket = require("./socket");

app.use(timeout("5s"));
app.use("/public", express.static("public"));
app.use(haltOnTimedout);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

socket.start(http);

// timeout handler middleware
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

// start server
http.listen(process.env.PORT || 3000, function () {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
