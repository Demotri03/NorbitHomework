const fs = require("fs");
const { parse } = require("csv-parse");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();
const boat1 = { latitude: [], longitude: [], heading: [], name: "boat 1" };
const boat2 = { latitude: [], longitude: [], heading: [], name: "boat 2" };
const boat3 = { latitude: [], longitude: [], heading: [], name: "boat 3" };

//getting CSV files:
function readCSV() {
  //boat 1
  fs.createReadStream("./lines/line1.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      boat1.latitude.push(row[0]);
      boat1.longitude.push(row[1]);
      boat1.heading.push(row[2]);
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      console.log("reading boat 1 finished");
    });

  //boat 2
  fs.createReadStream("./lines/line2.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      boat2.latitude.push(row[0]);
      boat2.longitude.push(row[1]);
      boat2.heading.push(row[2]);
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      console.log("reading boat 2 finished");
    });

  //boat 3

  fs.createReadStream("./lines/line3.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      boat3.latitude.push(row[0]);
      boat3.longitude.push(row[1]);
      boat3.heading.push(row[2]);
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {});
}

function compileBoatData(line) {
  let boat = { latitude: 0, longitude: 0, heading: 0, name: "" };
  if (!line.includes(undefined)) {
    boat.latitude = line[0];
    boat.longitude = line[1];
    boat.heading = line[2];
    boat.name = line[3];
    return boat;
  }
}

wss.on("connection", (ws) => {
  const id = uuidv4();
  const metadata = { id };

  clients.set(ws, metadata);
  readCSV();
  let myinterval = setInterval(() => {
    let msg1 = compileBoatData([
      boat1.latitude.shift(),
      boat1.longitude.shift(),
      boat1.heading.shift(),
      boat1.name,
    ]);
    let msg2 = compileBoatData([
      boat2.latitude.shift(),
      boat2.longitude.shift(),
      boat2.heading.shift(),
      boat2.name,
    ]);

    let msg3 = compileBoatData([
      boat3.latitude.shift(),
      boat3.longitude.shift(),
      boat3.heading.shift(),
      boat3.name,
    ]);

    let message = JSON.stringify({ boat1: msg1, boat2: msg2, boat3: msg3 });

    if (message == "{}") {
      clearInterval(myinterval);
    } else {
      ws.send(message);
    }
  }, 1000);

  ws.on("close", () => {
    clients.delete(ws);
  });
});

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

console.log("wss up");
