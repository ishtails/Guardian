import users from "../models/userModel.js";
import outings from "../models/outingModel.js";
import moment from "moment";

//Display all outing (With Filters)
export const outingTable = async (req, res) => {
  try {
    const { username, deadline, startDate, endDate, isOpen, reason } =
      req.query;

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
      const user = await users.findOne({ username: outing.username }, { username:1, name:1, mobile:1, hostel:1, room:1, idCard:1 });
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

//Display outings for specific student
export const studentOutings = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await users.findOne({ username });
    const outings = await outings.find({ username });

    const outingData = {
      username: user.username,
      name: user.name,
      mobile: user.mobile,
      hostel: user.hostel,
      room: user.room,
      idCard: user.idCard,
      outings: outings.map((outing) => ({
        outTime: outing.outTime,
        inTime: outing.inTime,
        reason: outing.reason,
        isOpen: outing.isOpen,
      })),
    };
    res.json({ student: outingData });
  } catch (error) {
    res.status(500).send(error);
  }
};