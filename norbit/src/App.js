import React from "react";
import { fromLonLat } from "ol/proj";
import { LineString, Point } from "ol/geom";
import "ol/ol.css";
import { useState } from "react";

import { RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle } from "rlayers";
const socket = new WebSocket("ws://127.0.0.1:7071");

export const App = () => {
  //Should have just used an object such as {[boat:n, coords:[lat,lon], heading:n]}
  let [boat1, setBoat1] = useState([]);
  let [boat2, setBoat2] = useState([]);
  let [boat3, setBoat3] = useState([]);
  let [boat1Heading, setBoat1Heading] = useState(0);
  let [boat2Heading, setBoat2Heading] = useState(0);
  let [boat3Heading, setBoat3Heading] = useState(0);

  socket.onmessage = ({ data }) => {
    let coords = JSON.parse(data);
    setBoat1([coords.boat1.longitude, coords.boat1.latitude]);
    setBoat1Heading([coords.boat1.heading]);
    setBoat2([coords.boat2.longitude, coords.boat2.latitude]);
    setBoat2Heading([coords.boat2.heading]);
    setBoat3([coords.boat3.longitude, coords.boat3.latitude]);
    setBoat3Heading([coords.boat3.heading]);
  };
  return (
    <div>
      <RMap
        width={"100%"}
        height={"60vh"}
        className="map"
        initial={{ center: fromLonLat([20.74010032, 48.2138001]), zoom: 15 }}
      >
        <ROSM />
        <RLayerVector zIndex={10}>
          <RStyle.RStyle>
            <RStyle.RCircle>
              <RStyle.RFill color="transparent" />
            </RStyle.RCircle>
          </RStyle.RStyle>
          <RFeature geometry={new Point(fromLonLat(boat1))}>
            <ROverlay className="no-interaction">
              <img
                src={"https://i.imgur.com/uenYWkR.png"}
                style={{
                  position: "relative",
                  transform: `rotate(${boat1Heading}deg)`,
                  top: -8,
                  left: -8,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                width={16}
                height={16}
                alt="icon"
              />
            </ROverlay>
          </RFeature>
          <RFeature geometry={new Point(fromLonLat(boat2))}>
            <ROverlay className="no-interaction">
              <img
                src={"https://i.imgur.com/uenYWkR.png"}
                style={{
                  position: "relative",
                  transform: `rotate(${boat2Heading}deg)`,
                  top: -8,
                  left: -8,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                width={16}
                height={16}
                alt="icon"
              />
            </ROverlay>
          </RFeature>
          <RFeature geometry={new Point(fromLonLat(boat3))}>
            <ROverlay className="no-interaction">
              <img
                src={"https://i.imgur.com/uenYWkR.png"}
                style={{
                  position: "relative",
                  transform: `rotate(${boat3Heading}deg)`,
                  top: -8,
                  left: -8,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                width={16}
                height={16}
                alt="icon"
              />
            </ROverlay>
          </RFeature>
        </RLayerVector>
      </RMap>
      <button>record</button>
    </div>
  );
};
export default App;