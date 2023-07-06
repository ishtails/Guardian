import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import apiRouter from "./routes/apiRoutes.js";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { rateLimit } from "express-rate-limit";

// Const declarations
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const MONG_URI = process.env.MONG_URI;

// Redis Initialization
const redisClient = createClient();
redisClient
  .connect()
  .then(console.log("Connected to Redis Session Store"))
  .catch(console.error);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(helmet());
app.use(limiter);
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
      secure: false,
      httpOnly: true,
      expires: 1000 * 60 * 60 * 24 * 1, // Cookie expires in 1 Day
    },
  })
);
export { redisClient };

// Database Connenction
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
