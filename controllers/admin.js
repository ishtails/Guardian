import users from "../models/userModel.js";
import outings from "../models/outingModel.js";
import moment from "moment";

//Master Table
export const studentTable = async (req, res) => {
  try {
    const { username, deadline, startDate, endDate, isOpen, reason } =
      req.query;

    const outingFilters = {};
    const userFilters = {};

    // Conditional Queries
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

    if (deadline) {
      outingFilters.penalty = deadline;
    }

    if (startDate && endDate) {
      outingFilters.outTime = {
        $gte: moment(startDate).toDate(),
        $lt: moment(endDate).add(1, "day").toDate(),
      };
    }

    
    // Fetching Outings
    const allOutings = await outings.find(outingFilters);
    let studentOutingData = [];

    for (const outing of allOutings) {
      const user = await users.findOne({ username: outing.username });
      
      console.log(user)

      const studentOutingObj = {
        username: user.username,
        name: user.name,
        mobile: user.mobile,
        hostel: user.hostel,
        room: user.room,
        idCard: user.idCard,
        isOpen: outing.isOpen,
        reason: outing.reason,
        penalty: outing.penalty,
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
