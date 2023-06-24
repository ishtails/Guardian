import users from "../models/userModel.js";
import outings from "../models/outingModel.js";

//Master Table
export const studentOutings = async (req, res) => {
  try {
    const { hostel, deadline, startDate, endDate } = req.query || {};

    const outingFilters = {};
    const userFilters = {};

    if (hostel) {
      userFilters.hostel = hostel;
    }

    const allOutings = await outings.find();
    let outingData = [];

    for (const outing of allOutings) {
      const user = await users.findOne({
        ...userFilters,
        username: outing.username,
      });

      const { reason, isOpen, outTime, inTime } = outing;

      const outingObj = {
        username: user.username,
        name: user.name,
        mobile: user.mobile,
        hostel: user.hostel,
        room: user.room,
        date: outTime,
        isOpen,
        reason,
        outTime,
        inTime,
      };

      outingData.push(outingObj);
    }

    res.status(200).send(outingData);
  } catch (error) {
    res.status(500).send(error);
  }
};