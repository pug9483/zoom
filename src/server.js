import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

//Http 서버
const server = http.createServer(app);

//WebSocket 서버
const wss = new WebSocket.Server({ server });

// 누군가가 우리 서버에 연결하면, connection저장 -> 받은 메시지를 다른 모든 socket에게 전달 가능하다.
const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser✅");
  socket.on("close", () => {
    console.log("Disconnected from the Browser❌");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} : ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});
server.listen(3000, () => console.log(`Listening on http://localhost:3000`));
