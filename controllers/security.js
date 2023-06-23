import outings from "../models/outingModel.js";
import users from "../models/userModel.js";

//Display Open Outing Entry
export const openEntries = async (req, res) => {
  try {
    const openOutings = await outings.find({ isOpen: true });
    const usernames = openOutings.map(outing => outing.username)
    console.log(usernames)
    
  } catch (error) {
    res.status(500).send(error);
  }
};

//Display Closed Outing Entry
export const closedEntries = async (req, res) => {
  try {
    const closedOutings = await outings.find({ isOpen: false });
    const studentArray = closedOutings.map((outing) => {
      outing.username;
      const studentData = getUserFunc(username);
      return studentData;
    });

    console.log(studentArray);
    res.json(studentArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

//Display outings of individual student
export const individualEntries = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await users.findOne({ username });
    const outings = await outings.find({ username });

    const outingData = {
      username: user.username,
      name: user.name,
      email: user.email,
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

//Display student info on search
export const studentOnSearch = async (req, res) => {
  try {
    const { searchKey } = req.params;
    const student = await users
      .find({
        $or: [{ name: searchKey }, { username: searchKey }],
      })
      .limit(5);

    if (!student) {
      return res.status(404).json({ error: "User not found" });
    }

    const studentData = {
      email: student.email,
      username: student.username,
      role: student.role,
      name: student.name,
      mobile: student.mobile,
      hostel: student.hostel,
      room: student.room,
    };

    res.status(200).send(studentData);
  } catch (error) {
    res.status(500).send(error);
  }
};

//Filter students
export const getStudents = (req, res) => {
  try {
    const filters = req.query || {};

    users
      .find({ ...filters, role: "student" })
      .then((students) => {
          let studentsDetails = []

          students.map((student) => {
            const studentData = {
              email: student.email,
              username: student.username,
              role: student.role,
              name: student.name,
              mobile: student.mobile,
              hostel: student.hostel,
              room: student.room,
            };

            studentsDetails.push(studentData)
          })
        res.status(200).json(studentsDetails);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
};

//Close Outing Entry
export const closeGateEntry = async (req, res) => {
  try {
    const { username } = req.params;
    outings
      .updateOne({ username, isOpen: true }, { $set: {isOpen: false, inTime: new Date()} })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(422).send(error);
  }
};
