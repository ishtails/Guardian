import geolib from "geolib";
import moment from "moment";
import * as dotenv from "dotenv";
dotenv.config();

// Check Session
export const requireAuth = (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  next();
};

//Verify Outing Checks
export const verifyOutingChecks = (req, res, next) => {
  // Check Timing
  const currentTime = moment().format("HH:mm");

  if (currentTime > "22:00" || currentTime < "05:00") {
    return res
      .status(403)
      .json({ message: "Cannot go out, intime deadline exceeded!" });
  }

  // Check Location
  const { latitude, longitude } = req.body;

  const centralLocation = { latitude: 26.250106, longitude: 78.17652 };
  const verificationRadius = 200;

  const distance = geolib.getDistance({ latitude, longitude }, centralLocation);

  if (distance <= verificationRadius) {
    next();
  } else {
    return res.status(403).send("Location verification failed!");
  }
};