import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import WebSocket from "ws";
const io = new Server(server);
import pg from "pg";
const { Client } = pg;
import { saveBoatData } from "./queries.js";
export const client = new Client({
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
  let boat = JSON.parse(data);
  console.log(boat);
  for (const b in boat) {
    if (boat.hasOwnProperty.call(boat, b)) {
      const element = boat[b];
      saveBoatData(element);
    }
  }
};
