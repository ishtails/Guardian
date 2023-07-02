import nodemailer from "nodemailer";
import { redisClient } from "../server.js";
import cloudinary from "cloudinary";
import NodeClam from "clamscan";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

export const clamScan = async (file) => {
  // Check for virus
  try {
    const clamscan = new NodeClam().init();
    const isInfected = await clamscan.isInfected(file);
    if (isInfected) {
      return new Error("Virus detected!");
    } else {
      return "File OK!";
    }
  } catch (error) {
    return error;
  }
};

// Upload Image to Cloudinary
export const uploadImage = async (file) => {
  try {
    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(file, {
      folder: "Guardian",
      allowed_formats: ["jpg", "jpeg", "png"],
    });
    const imageUrl = result.secure_url;
    return imageUrl;
  } catch (error) {
    return error;
  }
};

// Send Email
export const sendMail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    return { message: "ERROR: " + error };
  }
};

//Revoke User Sessions
export const revokeUserSessions = async (username) => {
  try {
    const sessionIds = await redisClient.sMembers(
      `active-sessions:${username}`
    );

    for (const sessionId of sessionIds) {
      await redisClient.DEL(`sess:${sessionId}`);
      console.log(`Session destroyed: sess:${sessionId}`);
    }

    await redisClient.DEL(`active-sessions:${username}`);
    console.log(`Active sessions cleared for user ${username}`);
  } catch (err) {
    console.error("Error revoking sessions:", err);
  }
};
