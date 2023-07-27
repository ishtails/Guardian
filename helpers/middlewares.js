import geolib from "geolib";
import moment from "moment";
import * as dotenv from "dotenv";
import outings from "../models/outingModel.js";
dotenv.config();

// Check Session
export const requireAuth = (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).json("Not Logged In");
  }

  next();
};

//Verify Outing Checks
export const verifyOutingChecks = async (req, res, next) => {
  //isStudent
  if (req.session.role !== "student") {
    return res.status(403).json("Only for students");
  }

  // isOutside
  const result = await outings.findOne(
    { username: req.session.username, isOpen: true },
    { username: 1 }
  );
  if (result) {
    return res.status(400).json("Already outside");
  }

  // Check Timing
  const currentTime = moment().format("HH:mm");
  if (currentTime > "22:00" || currentTime < "05:00") {
    return res.status(403).json("Intime deadline exceeded");
  }

  // Check Location
  const { latitude, longitude } = req.body;

  const centralLocation = { latitude: 26.250106, longitude: 78.17652 };
  const verificationRadius = 200;

  if(!latitude || !longitude){
    return res.status(404).json("Location undetermined");
  }

  const distance = geolib.getDistance({ latitude, longitude }, centralLocation);

  if (distance <= verificationRadius) {
    next();
  } else {
    return res.status(403).send("Location verification failed");
  }
};
