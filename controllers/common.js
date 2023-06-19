import users from "../models/userModel.js";

export const registerUser = (req, res) => {
  try {
    const {email, password, role} = req.body;
    const newUser = new users({email, password, role});

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

export const getUser = (req, res) => {
  try {
    const email = req.params["email"];
    users
      .findOne({ email })
      .then((obj) => {
        res.send(obj);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) { res.status(500).send(error); }
};