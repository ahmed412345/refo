import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import mongoConnect from "./config/connectDB.js";

import sourcesRouter from "./routes/scource.route.js";

import aiRouter from "./routes/ai.route.js";

app.use(express.json());

app.use("/api", sourcesRouter);

app.use("/api", aiRouter);

const startServer = async () => {
    //connect to database

    await mongoConnect();

    app.listen(process.env.PORT, () => {
        console.log("server is running now at " + process.env.PORT);
    });
};

startServer();
