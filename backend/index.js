import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import pkg from "minecraft-launcher-core";
const { Authenticator, Client } = pkg;

const launcher = new Client();
const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
const server = createServer(app); // Создаем HTTP сервер

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(port, async () => {
  console.log(`Сервер запущен! Порт ${port}`);
});

io.on("connection", (socket) => {
  console.log("Новое соединение WebSocket");

  socket.on("message", (data) => {
    const { username, password, root, version, type, memoryMax, memoryMin } =
      JSON.parse(data);

    console.log(username);
    setInterval(() => {
      socket.emit("download", "test");
      console.log("Inter");
    }, 1000);

    // let opts = {
    //   authorization: Authenticator.getAuth(username, password),
    //   root: root,
    //   version: {
    //     number: version,
    //     type: type,
    //   },
    //   memory: {
    //     max: `${memoryMax}G`,
    //     min: `${memoryMin}G`,
    //   },
    // };

    // launcher.launch(opts);

    // launcher.on("debug", (e) => console.log(e));
    // launcher.on("data", (e) => console.log(e));
  });

  socket.on("disconnect", () => {
    console.log("Соединение WebSocket закрыто");
  });
});
