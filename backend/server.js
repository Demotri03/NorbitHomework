const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const WebSocket = require("ws");
const io = new Server(server);
const { Client } = require("pg");
const client = new Client({
  user: "demo",
  host: "localhost",
  database: "norbit",
  password: "mypassword",
  port: 5432,
});
client.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const socket = new WebSocket("ws://127.0.0.1:7071");
socket.onmessage = ({ data }) => {
  let coords = JSON.parse(data);
  console.log(data);
};
