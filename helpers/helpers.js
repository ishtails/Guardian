import nodemailer from "nodemailer";
import { redisClient } from "../server.js";

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

//Revoke User Sessions
export const revokeUserSessions = async (username) => {
    try {
      const sessionIds = await redisClient.sMembers(`active-sessions:${username}`);
      
      for (const sessionId of sessionIds) {
        await redisClient.DEL(`sess:${sessionId}`);
        console.log(`Session destroyed: sess:${sessionId}`);
      }
  
      await redisClient.DEL(`active-sessions:${username}`);
      console.log(`Active sessions cleared for user ${username}`);
    } catch (err) {
      console.error('Error revoking sessions:', err);
    }
  };