import outings from "../models/outingModel.js";
import users from "../models/userModel.js";

//Display Open Outing Entry
export const openEntries = async (req, res) => {
  try {
    const openOutings = await outings.find({ isOpen: true });
    const usernames = openOutings.map((outing) => outing.username);
    console.log(usernames);
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
  const { username } = req.params;
  try {
    const user = await users.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found!");
    }
    const outing = await outings.find({ username });

    const studentInfo = {
      username: user.username,
      name: user.name,
      outing,
    };

    res.status(200).send(studentInfo);
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
        let studentsDetails = [];

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

          studentsDetails.push(studentData);
        });
        res.status(200).json(studentsDetails);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
};

//Close Outing Entry
export const closeEntry = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await outings.updateOne(
      { username, isOpen: true },
      { $set: { isOpen: false, inTime: new Date() } }
    );

    if (result.modifiedCount === 1) {
      return res.status(200).send("Successfully closed entry!");
    } else {
      return res.status(400).send("No open entries for this user!");
    }
  } catch (error) {
    res.status(500).send("Server Error!");
  }
};
