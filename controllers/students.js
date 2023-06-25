import outings from "../models/outingModel.js";
import users from "../models/userModel.js";

//Open Outing Entry
export const openGateEntry = async (req, res) => {
  try {
    const { username } = req.params;
    const { reason } = req.body;

    const result = await outings.findOne({ username, isOpen: true });
    if (result) {
      return res.status(400).send("Already outside!");
    }

    const newOuting = new outings({
      username,
      reason,
    });

    await newOuting.save();
    res.send("Outing Registered Successfully!");
  } catch (error) {
    res.status(422).send(error);
  }
};

// Outing Status
export const isOutside = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await outings.findOne({ username, isOpen: true });

    if (!result) {
      return res.status(200).json({ username, status: "inside" });
    } else {
      const { reason, outTime } = result;
      return res
        .status(200)
        .json({ username, status: "outside", outTime, reason });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

//update student info
export const updateInfo = async (req, res) => {
  try {
    const { username } = req.params;
    const {name, hostel, room, mobile } = req.body;
    if (!name) throw "Error! Provide your full name!";
    if (!hostel) throw "Error! Provide Hostel name!";
    if (!room) throw "Error! Provide your Room No.!";
    if (!mobile) throw "Error! Provide your Phone No.!";

    const result = await users.findOne({ username });

    if (!result) {
      return res.status(404).send("Username not found!");
    }

    result.name = name;
    result.hostel = hostel;
    result.room = room;
    result.mobile = mobile;

    await result.save();
    res.status(200).send("User Info updated Successfully!");
  } catch (error) {
    res.status(500).send(error);
  }
};
