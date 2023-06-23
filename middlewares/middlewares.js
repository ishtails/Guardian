import geolib from "geolib";

// Check Session
export const requireAuth = (req, res, next) => {
  if (!req.session.authenticated) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

//Verify Location
export const verifyLocation = (req, res, next) => {
  const { latitude, longitude } = req.body;

  // Gate Location & Radius
  const centralLocation = { latitude: 26.250106, longitude: 78.17652 };
  const verificationRadius = 200;

  const distance = geolib.getDistance({ latitude, longitude }, centralLocation);

  if (distance <= verificationRadius) {
    next();
  } else {
    return res.status(403).json({ error: "Location verification failed!" });
  }
};