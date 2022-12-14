import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import WebSocket from "ws";
const settings = {
  cors: true,
  origins: ["http://127.0.0.1:3001"],
};
const io = new Server(server, settings);
import pg from "pg";
const { Client } = pg;
import { saveBoatData } from "./queries.js";
let boatInfo;
let currentRecording = [];
let allRecordings = {};
let isRecording = false;
let isReplaying = false;

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
  if (boatInfo) {
    setInterval(function () {
      if (!isReplaying) {
        boatInfo.isReplaying = isReplaying;
        socket.emit("sending boat data", boatInfo);
      } else {
        let slice = currentRecording.shift();

        if (slice) {
          slice.isReplaying = isReplaying;
          socket.emit("sending boat data", slice);
        } else {
          isReplaying = false;
        }
      }
    }, 1000);

    socket.on("start recording", () => {
      isRecording = true;
    });
    socket.on("stop recording", () => {
      let timestamp = new Date();
      allRecordings[timestamp] = currentRecording;
      currentRecording = [];
      isRecording = false;
      socket.emit("sending recording", Object.keys(allRecordings));
    });
    socket.on("requesting recording", (recordName) => {
      currentRecording = JSON.parse(JSON.stringify(allRecordings[recordName]));
      isReplaying = true;
    });
  }
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

const socket = new WebSocket("ws://127.0.0.1:7071");
socket.onmessage = ({ data }) => {
  let boat = JSON.parse(data);
  boatInfo = boat;
  for (const b in boat) {
    if (boat.hasOwnProperty.call(boat, b)) {
      const element = boat[b];
      saveBoatData(element);
    }
  }
  if (isRecording) {
    currentRecording.push(boat);
  }
};
