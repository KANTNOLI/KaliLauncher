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
  socket.on("game", (data) => {
    const { username, password, root, version, type, memoryMax, memoryMin } =
      JSON.parse(data);

    let opts = {
      authorization: Authenticator.getAuth(username, password),
      javaPath: "C:/Program Files/Java/jre1.8.0_51/bin/java.exe",
      root: "./minecraft",
      version: {
        number: version,
        type: type,
      },
      memory: {
        max: "6G",
        min: "4G",
      },
    };

    launcher.launch(opts);

    launcher.on("debug", (e) => console.log("Debug:", e));
    launcher.on("data", (e) => console.log("Data:", e));

    launcher.on("progress", (data) => {
      socket.emit("download", data);
      console.log(data);
    });

    // launcher.on("package-extract", (data) => {
    //   socket.emit("finish", data);
    //   console.log(e);
    // });
  });
});
