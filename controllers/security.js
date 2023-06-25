import moment from "moment";
import outings from "../models/outingModel.js";
import users from "../models/userModel.js";

//Display student info on search
export const studentOnSearch = async (req, res) => {
  try {
    const { key } = req.query;
    const regexKey = new RegExp(key, "i");

    const user = await users
      .find(
        { $or: [{ username: regexKey }, { name: regexKey }] },
        { _id: 0, username: 1, name: 1 }
      )
      .sort({ name: 1 })
      .limit(5);
    res.status(200).send(user);
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

// Close Entry
export const closeGateEntry = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await outings.findOne({ username, isOpen: true });

    if (!result) {
      return res.status(404).send("No open entries for this user!");
    }

    result.isOpen = false;
    result.inTime = new Date();

    // //Late (in minutes) calculation
    const outDate = moment(result.outTime).format("YYYY-MM-DD");
    const deadlineTime = moment(
      `${outDate} "22:00:00"`,
      "YYYY-MM-DD HH:mm:ss"
    ).toDate();
    const lateInMinutes = moment(result.inTime).diff(moment(deadlineTime), "minutes");
    result.lateBy = lateInMinutes;
    
    await result.save();

    res.status(200).send("Entry closed successfully!");
  } catch (error) {
    res.status(500).send(error);
  }
};

//Close Outing Entry
// export const closeEntry = async (req, res) => {
//   try {
//     const { username } = req.params;
//     const result = await outings.updateOne(
//       { username, isOpen: true },
//       { $set: { isOpen: false, inTime: new Date() } }
//     );

//     if (result.modifiedCount === 1) {
//       return res.status(200).send("Successfully closed entry!");
//     } else {
//       return res.status(400).send("No open entries for this user!");
//     }
//   } catch (error) {
//     res.status(500).send("Server Error!");
//   }
// };

// //Display Open Outing Entry
// export const openEntries = async (req, res) => {
//   try {
//     const openOutings = await outings.find({ isOpen: true });
//     const usernames = openOutings.map((outing) => outing.username);
//     console.log(usernames);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// //Display Closed Outing Entry
// export const closedEntries = async (req, res) => {
//   try {
//     const closedOutings = await outings.find({ isOpen: false });
//     const studentArray = closedOutings.map((outing) => {
//       outing.username;
//       const studentData = getUserFunc(username);
//       return studentData;
//     });

//     console.log(studentArray);
//     res.json(studentArray);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };
