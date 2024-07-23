import express from "express";
import pg from "pg-promise";

const app = express();

const port = process.env.PORT || 3001;

const bd = pg()({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "5432",
  port: 5432,
});

app.listen(port, async () => {
  console.log(`Сервер запущен! Путь ${port}`);
});

app.get("/users", (req, res) => {
  const userName = req.query.name ? req.query.name : "";
});

app.get("/messages", (req, res) => {
  const id = req.query.id ? req.query.id : 0;
}); 
//Работа с Базой данных
