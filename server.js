const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

io.on("connection", (socket) => {

  socket.on("broadcaster", () => {
    socket.broadcast.emit("broadcaster");
  });

  socket.on("watcher", () => {
    socket.broadcast.emit("watcher", socket.id);
  });

  socket.on("offer", (id, message) => {
    io.to(id).emit("offer", socket.id, message);
  });

  socket.on("answer", (id, message) => {
    io.to(id).emit("answer", socket.id, message);
  });

  socket.on("candidate", (id, message) => {
    io.to(id).emit("candidate", socket.id, message);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnectPeer", socket.id);
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Servidor listo en " + PORT));
