import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import apiRouter from './routes/routes.js'

// Const declarations
const app = express();
const PORT = process.env.PORT;
const MONG_URI = process.env.MONG_URI;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

// Database Connenction & Port Listening
mongoose
  .connect(MONG_URI)
  .then(
    app.listen(PORT, () => {
      console.log(
        `Connected to local MongoDB Server & Listening on http://localhost:${PORT}/`
      );
    })
  )
  .catch((err) => {
    console.log(err);
  });

// Root Route
app.get("/", (req, res) => {
  res.send("Server Home Page");
});

app.use("/api", apiRouter);
