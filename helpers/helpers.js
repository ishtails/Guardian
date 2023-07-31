import nodemailer from "nodemailer";
import { redisClient } from "../server.js";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import * as dotenv from "dotenv";
dotenv.config();

//Multer Cloudinary Storage
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "Guardian",
    public_id: (req, file) => file.fieldname + "-" + req.session.username,
  },
});

export const upload = multer({ storage: storage });

// Send Email
export const sendMail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_APP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    return info;

  } catch (error) {
    return error.message;
  }
};

//Revoke User Sessions
export const revokeUserSessions = async (username) => {
  try {
    const sessionIds = await redisClient.sMembers(
      `user-sess:${username}`
    );

    for (const sessionId of sessionIds) {
      await redisClient.DEL(`sess:${sessionId}`);
    }

    await redisClient.DEL(`user:${username}`);
    return (`Active sessions cleared for ${username}`);
  } catch (err) {
    return new Error("Could not revoke sessions");
  }
};

export const removeExpiredUserSessions = async (username) => {
  try {
    const sessionIds = await redisClient.sMembers(
      `user-sess:${username}`
    );

    for (const sessionId of sessionIds) {
      const sessionExists = await redisClient.exists(`sess:${sessionId}`);
      if (!sessionExists) {
        await redisClient.sRem(`user-sess:${username}`, sessionId);
      }
    }

    console.log(`Expired members removed for ${username}`)
  } catch (err) {
    console.error(err);
  }
};
