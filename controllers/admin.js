import users from "../models/userModel.js";
import outings from "../models/outingModel.js";
import moment from "moment";

//Master Table
export const studentTable = async (req, res) => {
  try {
    const { hostel, room, deadline, startDate, endDate } = req.query;

    const outingFilters = {};
    const userFilters = {};

    if (hostel) {
      userFilters.hostel = hostel;
    }

    if (deadline) {
      outingFilters.penalty = deadline;
    }

    if (startDate && endDate) {
      outingFilters.outTime = {
        $gte: moment(startDate).toDate(),
        $lt: moment(endDate).add(1, 'day').toDate(),
      }
    }

    const allOutings = await outings.find(outingFilters);
    let outingData = [];

    for (const outing of allOutings) {
      const user = await users.findOne({
        username: outing.username,
      });

      const { reason, isOpen, outTime, inTime, penalty } = outing;

      const outingObj = {
        username: user.username,
        name: user.name,
        mobile: user.mobile,
        hostel: user.hostel,
        room: user.room,
        profilePic: user.profilePic,
        idCard: user.idCard,
        isOpen,
        reason,
        penalty,
        outTime: moment(outTime).format("DD-MM-YYYY HH:mm"),
        inTime: moment(inTime).format("DD-MM-YYYY HH:mm"),
      };

      outingData.push(outingObj);
    }

    res.status(200).send(outingData);
  } catch (error) {
    res.status(500).send(error);
  }
};
