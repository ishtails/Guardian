import outings from "../models/outingModel.js";

//Display Open Outing Entry
export const openEntries = async (req, res) => {
  try {
    const openOutings = await outings.find({ isOpen: true });
    const studentUsernames = openOutings.map((outing) => outing.username);

    //abhi ke liye we are printing the usernames only
    console.log(studentUsernames);
    res.json({ students: studentUsernames });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Display Closed Outing Entry
export const closedEntries = async (req, res) => {
  try {
    const closedOutings = await outings.find({ isOpen: false });
    const studentUsernames = closedOutings.map((outing) => outing.username);

    //abhi ke liye we are printing the usernames only
    console.log(studentUsernames);
    res.json({ students: studentUsernames });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Display student info on search
export const studentOnSearch = async (req, res) => {
  try {
    const { username } = req.params;
    const outings = await outings.find({ username });
    const user = await user.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const studentData = {
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
    res.json({ student: studentData }); 
  } catch (error) {
    res.status(500).send(error);
  }
};
