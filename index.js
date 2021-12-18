const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);

app.use("/public", (req, res) => {
  res.setHeader("Cache-Control", `max-age=${60 * 60 * 24}`);
  res.removeHeader("Pragma");
  res.removeHeader("Expires");
  res.sendFile(path.join(__dirname, req.originalUrl));
});

app.get("/*", function (_req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// start server
http.listen(process.env.PORT || 3000, function () {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
