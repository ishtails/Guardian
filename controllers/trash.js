// import users from "../models/userModel.js";
// import outings from "../models/outingModel.js";
// import moment from "moment";


//Display outings for specific student
// export const studentOutings = async (req, res) => {
//   try {
//     const username = req.params.username;
//     const user = await users.findOne({ username });
//     const outings = await outings.find({ username });

//     const outingData = {
//       username: user.username,
//       name: user.name,
//       mobile: user.mobile,
//       hostel: user.hostel,
//       room: user.room,
//       idCard: user.idCard,
//       outings: outings.map((outing) => ({
//         outTime: outing.outTime,
//         inTime: outing.inTime,
//         reason: outing.reason,
//         isOpen: outing.isOpen,
//       })),
//     };
//     res.json({ student: outingData });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };


// //update student info
// export const updateInfo = async (req, res) => {
//   try {
//     const { username } = req.params;
//     const {name, hostel, room, mobile } = req.body;
//     if (!name) throw "Error! Provide your full name!";
//     if (!hostel) throw "Error! Provide Hostel name!";
//     if (!room) throw "Error! Provide your Room No.!";
//     if (!mobile) throw "Error! Provide your Phone No.!";

//     const result = await users.findOne({ username });

//     if (!result) {
//       return res.status(404).send("Username not found!");
//     }

//     result.name = name;
//     result.hostel = hostel;
//     result.room = room;
//     result.mobile = mobile;

//     await result.save();
//     res.status(200).send("User Info updated Successfully!");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };


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


//Filter students
// export const getStudents = (req, res) => {
//     try {
//       const filters = req.query || {};
  
//       users
//         .find({ ...filters, role: "student" })
//         .then((students) => {
//           let studentsDetails = [];
  
//           students.map((student) => {
//             const studentData = {
//               email: student.email,
//               username: student.username,
//               role: student.role,
//               name: student.name,
//               mobile: student.mobile,
//               hostel: student.hostel,
//               room: student.room,
//             };
  
//             studentsDetails.push(studentData);
//           });
//           res.status(200).json(studentsDetails);
//         })
//         .catch((err) => res.status(400).send(err));
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   };

// import NodeClam from "clamscan";
// export const clamScan = async (file) => {
//   // Check for virus
//   try {
//     const clamscan = new NodeClam().init();
//     const isInfected = await clamscan.isInfected(file);
//     if (isInfected) {
//       return new Error("Virus detected!");
//     } else {
//       return "File OK!";
//     }
//   } catch (error) {
//     return error;
//   }
// };