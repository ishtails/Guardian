import geolib from "geolib";
import Joi from "joi";
import moment from "moment";
import nodemailer from "nodemailer";

// Check Session
export const requireAuth = (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Unauthorized" });
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

// OTP Generation
export const generateOTP = (req, res, next) => {
  next();
};

// OTP Verification
export const verifyOTP = (req, res, next) => {
  next();
};

// Send Email
export const sendEmail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ishtails@gmail.com",
        pass: process.env.GMAIL_PASS,
      },
    });

    const emailSchema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .custom((value, helpers) => {
          if (value.endsWith("@iiitm.ac.in")) {
            return value;
          } else {
            return helpers.error("any.invalid");
          }
        }, "Custom Domain Validation"),
    });

    await emailSchema.validateAsync(req.body);
    const { email } = req.body;
    const otp = 123456;

    const mailOptions = {
      from: "ishtails@gmail.com",
      to: email,
      subject: "Guardian - Gate Entry / Exit System",
      html: `
      <h1>Email Verification</h1>
      <h3>Hello there,</h3>
      <p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong></p>
      <p>Please enter this OTP to complete the verification process.</p>
      <p>If you did not request this verification, you can safely ignore this email.</p>
      <p>Thank you!</p>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).send(info);
  } catch (error) {
    res.status(500).json({message: "ERROR: " + error});
  }
};
