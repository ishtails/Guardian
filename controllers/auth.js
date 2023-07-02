import users from "../models/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import Joi from "joi";
import otpGenerator from "otp-generator";
import { fileURLToPath } from "url";
import { redisClient } from "../server.js";
import { revokeUserSessions, sendMail } from "../helpers/helpers.js";

// Login User
export const loginUser = async (req, res) => {
  try {
    if (req.session.username) {
      return res.status(400).send("Already logged in!");
    }

    //Form Validation
    const loginSchema = Joi.object({
      id: Joi.string().required(),
      password: Joi.string().min(3).required(),
    });

    await loginSchema.validateAsync(req.body);

    //Search in DB
    const { id, password } = req.body;
    const user = await users.findOne(
      {
        $or: [{ email: id }, { username: id }],
      },
      { password: 1, username: 1, role: 1, name: 1 }
    );

    if (!user) {
      return res.status(404).send("Not registered!");
    }

    //Verify Password
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (passwordCorrect) {
      req.session.username = user.username;
      req.session.role = user.role;

      // Update active-sessions of user
      redisClient.SADD(
        `active-sessions:${user.username}`,
        req.sessionID,
        (err, result) => {
          if (err) {
            console.error("Error adding session to active sessions:", err);
          }
        }
      );

      return res.status(200).json({
        username: user.username,
        role: user.role,
        message: `Login Successful`,
      });
    } else {
      return res.status(400).send("Wrong Password");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const isRegistered = async (req, res) => {
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
      res.status(200).send({ email, isRegistered: true });
    } else {
      res.status(200).send({ email, isRegistered: false });
    }
  } catch (error) {
    if (error.details) {
      return res.status(422).json(error.details);
    }

    return res.status(500).json("ERROR: " + error);
  }
};

// OTP Generation
export const sendOTP = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ error: "No Email Provided!" });
    }

    if(req.session.username){
      return res.status(403).json({ error: "Already Logged in!" });
    }

    //Generate & Store OTP in redis
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //load OTP Email template
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const otpTemplate = fs
      .readFileSync(path.join(__dirname, "../others/otpTemplate.html"), "utf-8")
      .replace("{{otp}}", otp);

    //NodeMailer
    const mailOptions = {
      from: process.env.GMAIL_ID,
      to: req.body.email,
      subject: "Guardian - OTP Verification",
      html: otpTemplate,
    };

    const result = await sendMail(mailOptions);

    // Store temporary information
    req.session.otp = otp;
    req.session.email = req.body.email;
    req.session.otpExpiry = Date.now() + 300000; //5 Minutes from now

    return res.json({ message: "OTP Sent Successfully!", result });
  } catch (error) {
    return res.status(500).json({ message: "ERROR: " + error });
  }
};

// OTP Verification
export const verifyOTP = async (req, res) => {
  try {
    if(req.session.username){
      return res.status(403).send("Already Logged in!");
    }

    const userEnteredOTP = req.body.otp;
    const storedOTP = req.session.otp;
    const storedOTPExpiry = req.session.otpExpiry;

    if (!req.session.otp || !req.session.otpExpiry || !req.session.email) {
      return res.status(400).send("No OTP generated!");
    }

    if (Date.now() > storedOTPExpiry) {
      delete req.session.otp;
      delete req.session.email;
      delete req.session.otpExpiry;
      return res.status(401).send("OTP expired!");
    }

    if (userEnteredOTP === storedOTP) {
      delete req.session.otp;
      delete req.session.otpExpiry;
      req.session.tempSessionExp = Date.now() + 300000; //5 Minutes from now
      return res.send("OTP Verified Successfully!");
    } else {
      return res.status(400).send("Wrong OTP!");
    }
  } catch (error) {
    return res.status(500).json("ERROR: " + error);
  }
};

//Register user
export const registerStudent = async (req, res) => {
  try {
    console.log(req.session);

    const email = req.session.email;
    const { password } = req.body;

    if (req.session.username) {
      return res.status(400).json({ error: "Already logged in!" });
    }

    if (
      !req.session.tempSessionExp ||
      Date.now() > req.session.tempSessionExp
    ) {
      return res.status(401).send("Session Expired!");
    }

    //Form Validation
    const registerSchema = Joi.object({
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
      password: Joi.string().pattern(
        new RegExp(
          "^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%*#?&]{8,}$"
        )
      ),
    });

    await registerSchema.validateAsync({ email, password });

    // Destructuring Values
    const username = email.split("@")[0];
    const role = "student";

    // Hash password & save to mongoDB
    const hash = await bcrypt.hash(password, 15);
    const newUser = new users({ email, password: hash, role, username });
    await newUser.save();

    // Clear Temp Session
    delete req.session.isRegistered;
    delete req.session.tempSessionExp;
    delete req.session.email;

    res.json({ message: "Registered Successfully!", username, role });
  } catch (error) {
    if (error.details) {
      return res
        .status(422)
        .json(error.details.map((detail) => detail.message).join(", "));
    }

    return res.status(500).json({ error: "ERROR: " + error });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    let id = null;
    if (req.session.username) {
      id = req.session.username;
    } else {
      id = req.session.email;
    }

    if (!id) {
      return res.status(400).send({ error: "No login or OTP based temp active session!" });
    }

    console.log(id)

    const { currentPassword, newPassword } = req.body;

    // Match Current Password
    const user = await users.findOne(
      { $or: [{ username: id }, { email: id }] },
      { password: 1, username: 1 }
    );
    if (!user) {
      return res.status(404).send("Not registered!");
    }

    const passwordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(400).send("Current Password doesn't match!");
    }

    // Same Password Check
    if(currentPassword === newPassword){
      return res.status(400).send({ error: "Old & new password cannot be same" });
    }

    //newPassword Validation
    const passwordSchema = Joi.object({
      password: Joi.string().pattern(
        new RegExp(
          "^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%*#?&]{8,}$"
        )
      ),
    });

    await passwordSchema.validateAsync({ password: newPassword });

    // Revoke all active user sessions
    revokeUserSessions(user.username);

    // Save new password to mongoDB
    const newHash = await bcrypt.hash(newPassword, 15);
    user.password = newHash;
    await user.save();
    res.send({ message: "Password Reset Successful!" });
  } catch (error) {
    if (error.details) {
      return res.status(422).json(error);
    }

    res.status(500).json({ message: "ERROR RESETTING PASSWORD", error });
  }
};