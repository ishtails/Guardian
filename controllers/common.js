import users from "../models/userModel.js";

//Register user
export const registerUser = (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      throw "Error! Provide an email!";
    }

    if (!(role === "admin" || role === "security" || role === "student")) {
      throw "Error! Invalid Role!";
    }

    const username = email.split("@")[0];
    const newUser = new users({ email, password, role, username });

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

// Get user by username
export const getUser = (req, res) => {
  try {
    const { username } = req.params;
    users
      .findOne({ username })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
};

//Get students
export const getStudents = (req, res) => {
  try {
    const filters = req.query || {};

    users
      .find({ ...filters, role: "student" })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
};

//Update User Details
export const updateUser = (req, res) => {
  try {
    const newObject = req.body;
    const username = req.params.username;
    users
      .updateOne({ username }, { $set: newObject })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
};
