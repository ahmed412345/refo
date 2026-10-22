/* Created by Ahmed Eltahan - 2026 */
import mongoConnect from "./config/connectDB.js";
import sourcesRouter from "./routes/scource.route.js";

// import aiRouter from "./routes/ai.route.js";
import tripRouter from "./routes/trip.route.js";
import express from "express";
import cors from "cors";


const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", sourcesRouter);

// app.use("/api", aiRouter);
app.use("/api", tripRouter);

const startServer = async () => {
    //connect to database

    await mongoConnect();

    app.listen(process.env.PORT, () => {
        console.log("server is running now at " + process.env.PORT);
    });
};

startServer();
