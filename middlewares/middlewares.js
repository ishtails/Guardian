import geolib from "geolib";
import moment from "moment";

// Check Session
export const requireAuth = (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

//Verify Outing Checks
export const verifyOutingChecks = (req, res, next) => {
  // Check Timing
  const currentTime = moment().format("HH:mm");

  if (currentTime > "22:00" || currentTime < "05:00") {
    return res.status(403).send("Cannot go out, deadline exceeded!");
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

//Deadline Penalty
export const penaltyCalc = (outTime, inTime) => {
  const outDate = moment(outTime).format("YYYY-MM-DD");
  const deadline = moment(
    `${outDate} "22:00:00"`,
    "YYYY-MM-DD HH:mm:ss"
  ).toDate();
  const lateInMinutes = moment(inTime).diff(moment(deadline), "minutes");

  let penalty = 0;
  if (lateInMinutes > 0 && lateInMinutes < 1 * 60) {
    penalty = 10;
  }

  if (lateInMinutes > 1 * 60 && lateInMinutes < 1 * 60) {
    penalty = 11;
  }

  if (lateInMinutes > 2 * 60) {
    penalty = 12;
  }

  return penalty;
};