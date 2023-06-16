import users from "../models/userModel.js";

export const createUser = (req, res) => {
  const user = req.body;

  const newUser = new users(user);
  
  newUser
    .save()
    .then((msg)=>{res.send(msg)})
    .catch((err) => {
      res.send(err);
    });
};
