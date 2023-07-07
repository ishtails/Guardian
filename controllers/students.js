import outings from "../models/outingModel.js";

//Open Outing Entry
export const openGateEntry = async (req, res) => {
  try {
    if(req.session.username !== "student"){
      return res.json("Only for students")
    }

    const { username } = req.session;
    const { reason } = req.body;

    const result = await outings.findOne({ username, isOpen: true });
    if (result) {
      return res.status(400).json("Already outside");
    }

    const newOuting = new outings({
      username,
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
    const result = await outings.findOne({ username, isOpen: true }, {reason:1, outTime:1});

    if (!result) {
      return res.status(200).json({ username, status: "inside" });
    } else {
      const { reason, outTime } = result;
      return res
        .status(200)
        .json({ username, status: "outside", outTime, reason });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

