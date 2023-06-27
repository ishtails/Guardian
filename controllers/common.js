import users from "../models/userModel.js";
import outings from "../models/outingModel.js";
import bcrypt from "bcrypt";
import moment from "moment";
import Joi from "joi";

//Import Cloudinary
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

//Register user
export const registerStudent = async (req, res) => {
  try {
    if (req.session.username) {
      return res.status(400).json({ error: "You are logged in!" });
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

    await registerSchema.validateAsync(req.body);

    // Destructuring Values
    const { email, password } = req.body;
    const username = email.split("@")[0];
    const role = "student";

    // Hash password & save to mongoDB
    const hash = await bcrypt.hash(password, 10);
    const newUser = new users({ email, password: hash, role, username });
    await newUser.save();
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

// Login User
export const loginUser = async (req, res) => {
  try {
    if (req.session.username) {
      return res.status(400).send("Already logged in!");
    }

    //Form Validation
    const registerSchema = Joi.object({
      id: Joi.string().required(),
      password: Joi.string().min(3).required(),
    });

    await registerSchema.validateAsync(req.body);

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
      return res.status(200).json({
        username: user.username,
        role: user.role,
        message: `Login Successful`,
      });
    } else {
      return res.status(400).send("Bad Credentials");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.clearCookie("sid");
    res.json({ message: "Logged out successfully" });
  });
};

// Upload Image to Cloudinary
const uploadImage = async (file) => {
  try {
    const { file } = req.body;
    const result = await cloudinary.uploader.upload(file.path);

    const imageUrl = result.secure_url;
    return imageUrl;
  } catch (error) {
    res.status(500).send("Failed to upload image to Cloudinary.");
  }
};
//Update User Details
export const updateUser = (req, res) => {
  try {
    const newObject = req.body;
    const { name, mobile, hostel, room, idCard } = newObject;

    const imageUrl = uploadImage(idCard);
    const updateFields = { name, mobile, hostel, room, imageUrl };

    const username = req.session.username;
    users
      .updateOne({ username }, { $set: updateFields })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(500).json({ error: "ERROR: " + error });
  }
};

// Get User
export const getCurrentUser = async (req, res) => {
  try {
    const username = req.session.username;
    const user = await users.findOne(
      { username },
      {
        _id: 0,
        email: 1,
        username: 1,
        name: 1,
        role: 1,
        name: 1,
        mobile: 1,
        hostel: 1,
        room: 1,
      }
    );
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

//Get Outings
export const getOutings = async (req, res) => {
  try {
    const { username, isLate, startDate, endDate, isOpen, reason } = req.query;
    const outingFilters = {};

    // Conditional Outing Queries
    if (reason) {
      const regexReason = new RegExp(reason, "i");
      outingFilters.reason = regexReason;
    }

    if (username) {
      outingFilters.username = username;
    }

    if (isOpen) {
      outingFilters.isOpen = isOpen;
    }

    if (isLate) {
      outingFilters.lateBy = { $gt: 0 };
    }

    if (startDate && endDate) {
      outingFilters.outTime = {
        $gte: moment(startDate).toDate(),
        $lt: moment(endDate).add(1, "day").toDate(),
      };
    }

    // Role-Based Control
    if (req.session.role === "student") {
      outingFilters.username = req.session.username;
    }

    if (req.session.role === "security") {
      outingFilters.outTime = {
        $gte: moment().subtract(1, "day").toDate(),
        $lt: moment().add(1, "day").toDate(),
      };
    }

    // Fetching Outings
    const allOutings = await outings.find(outingFilters);
    let studentOutingData = [];

    for (const outing of allOutings) {
      const user = await users.findOne(
        { username: outing.username },
        {
          _id: 0,
          username: 1,
          name: 1,
          mobile: 1,
          hostel: 1,
          room: 1,
          idCard: 1,
        }
      );

      let lateBy = "0";
      if (outing.lateBy > 0) {
        const duration = moment.duration(outing.lateBy, "minutes");
        lateBy = moment.utc(duration.asMilliseconds()).format("HH:mm");
      }

      const studentOutingObj = {
        username: user.username,
        name: user.name,
        mobile: user.mobile,
        hostel: user.hostel,
        room: user.room,
        idCard: user.idCard,
        isOpen: outing.isOpen,
        reason: outing.reason,
        lateBy,
        outTime: moment(outing.outTime).format("DD-MM-YYYY HH:mm"),
        inTime: moment(outing.inTime).format("DD-MM-YYYY HH:mm"),
      };

      studentOutingData.push(studentOutingObj);
    }

    res.status(200).send(studentOutingData);
  } catch (error) {
    res.status(500).send(error);
  }
};
