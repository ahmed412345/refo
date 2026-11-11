/* Created by Ahmed Eltahan - 2026 */
import mongoConnect from "./config/connectDB.js";
import { addTrip } from "./controllers/trip.js";
import { addMuseum } from "./controllers/museum.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

app.post("/api/trip", addTrip);
app.post("/api/museums", addMuseum);
app.post("/api/museum", addMuseum);

const startServer = async () => {
    //connect to database

    await mongoConnect();

    app.listen(process.env.PORT, () => {
        console.log("server is running now at " + process.env.PORT);
    });
};

startServer();
