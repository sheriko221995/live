const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

/* 👁️ CONTADOR DE USUARIOS */
let viewers = 0;

io.on("connection", (socket) => {

  // 🔴 broadcaster (emisor)
  socket.on("broadcaster", () => {
    socket.broadcast.emit("broadcaster");
  });

  // 👁️ viewer (receptor)
  socket.on("watcher", () => {
    viewers++;

    io.emit("viewerCount", viewers); // 🔥 enviar a todos

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

  // ❌ cuando alguien se va
  socket.on("disconnect", () => {

    viewers--;
    if (viewers < 0) viewers = 0;

    io.emit("viewerCount", viewers); // 🔥 actualizar todos

    socket.broadcast.emit("disconnectPeer", socket.id);
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Servidor listo en " + PORT));
