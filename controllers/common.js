import users from "../models/userModel.js";

//Register user
export const registerUser = (req, res) => {
  try {
    const { email, password, role } = req.body;
    const newUser = new users({ email, password, role });

    newUser
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a user by email
export const getUser = (req, res) => {
  try {
    const email = req.params["email"];
    users
      .findOne({ email })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
};

//Get all students
export const getStudents = (req, res) => {
  try {
    users
      .find({ role: "student" })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
};