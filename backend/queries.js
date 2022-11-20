import { client } from "./server";

export const saveBoatData = (boat) => {
  client.query(
    'INSERT INTO "Boats" (name, latitude, longitude,heading) VALUES ($1, $2, $3, $4)',
    [boat.name, boat.latitude, boat.longitude, boat.heading],
    (error) => {
      if (error) {
        throw error;
      }
    }
  );
};
