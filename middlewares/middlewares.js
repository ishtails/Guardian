import geolib from "geolib";
import Joi from "joi";
import moment from "moment";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import otpGenerator from "otp-generator";
import users from "../models/userModel.js";

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

// OTP Generation
export const sendOTP = async (req, res) => {
  try {
    //Generate & Store OTP in redis
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    if (req.body.email) {
      req.session.email = req.body.email;
    }

    req.session.otp = otp;
    req.session.otpExpiry = Date.now() + 300000; //5 Minutes from now

    //load OTP Email template
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const otpTemplate = fs
      .readFileSync(path.join(__dirname, "../others/otpTemplate.html"), "utf-8")
      .replace("{{otp}}", otp);

    //Configure options for NodeMailer
    const mailOptions = {
      from: "ishtails@gmail.com",
      to: req.body.email,
      subject: "Guardian - OTP Verification",
      html: otpTemplate,
    };

    const result = await sendMail(mailOptions);
    return res.json({ message: "OTP Sent Successfully!", result });
  } catch (error) {
    res.status(500).json({ message: "ERROR: " + error });
  }
};

// OTP Verification
export const verifyOTP = async (req, res) => {
  try {
    const userEnteredOTP = req.body.otp;
    const storedOTP = req.session.otp;
    const storedOTPExpiry = req.session.otpExpiry;

    if (!storedOTP || !storedOTPExpiry) {
      return res.status(401).send("No OTP generated!");
    }

    if (Date.now() > storedOTPExpiry) {
      delete req.session.otp;
      delete req.session.otpExpiry;
      return res.status(401).send("OTP expired!");
    }

    if (userEnteredOTP === storedOTP) {
      delete req.session.otp;
      delete req.session.otpExpiry;
      req.session.tempSessionExp = Date.now() + 300000; //5 Minutes from now
      res.send("OTP Verified Successfully!");
    } else {
      return res.status(400).send("Wrong OTP!");
    }
  } catch (error) {
    return res.status(500).json("ERROR: " + error);
  }
};

// Send Email
export const sendMail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ishtails@gmail.com",
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    return { message: "ERROR: " + error };
  }
};

export const isRegistered = async (req, res, next) => {
  try {
    const email = req.body.email;

    //Email Validation
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

    await emailSchema.validateAsync({ email });

    // isRegistered
    const user = await users.findOne({ email }, { _id: 0, username: 1 });
    if (user) {
      res.status(200).send({  email, isRegistered: true });
    } else {
      res.status(200).send({  email, isRegistered: false });
    }
  } catch (error) {
    if(error.details){
      return res.status(422).json(error.details)
    }

    return res.status(500).json("ERROR: " + error);
  }
};