import outings from "../models/outingModel.js";

//Open Outing Entry
export const openEntries = async (req, res) => {
    try {
        const openOutings = await outings.find({ isOpen: true });
        const studentUsernames = openOutings.map(outing => outing.username);
    
        //abhi ke liye we are printing the usernames only
        res.json({ students: studentUsernames });
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
  };
  