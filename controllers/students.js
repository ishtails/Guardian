import outings from "../models/outingModel.js";
import users from "../models/userModel.js";

//Open Outing Entry
export const openGateEntry = async (req, res) => {
  try {
    const { username } = req.session;
    const { reason } = req.body;

    const { gender } = await users.findOne({ username }, { gender: 1 });

    const newOuting = new outings({
      username,
      gender,
      reason,
    });

    await newOuting.save();
    return res.json("Outing Registered Successfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Outing Status
export const isOutside = async (req, res) => {
  try {
    const { username } = req.session;
    const result = await outings.findOne(
      { username, isOpen: true },
      { reason: 1, outTime: 1 }
    );

    if (!result) {
      return res.status(200).json("inside");
    } else {
      const { reason, outTime } = result;
      return res.status(200).json("outside");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
