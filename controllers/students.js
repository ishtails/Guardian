import outings from "../models/outingModel.js";

//Open Outing Entry
export const openGateEntry = async (req, res) => {
  try {
    const { username } = req.params;
    const { reason } = req.body;

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