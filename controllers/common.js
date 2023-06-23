import users from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getFunc = async (username) => {
  try {
    const result = await users.findOne({ username });
    const userData = {
      email: result.email,
      username: result.username,
      role: result.role,
      name: result.name,
      mobile: result.mobile,
      hostel: result.hostel,
      room: result.room,
    };
    return userData;
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get user details from username
export const getUser = async (req, res) => {
  try {
    const username = req.params.username;
    const userData = await getFunc(username);
    res.send(userData);
  } catch (error) {
    res.status(500).send(error);
  }
};

//Register user
export const registerUser = (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) throw "Error! Provide an email!";
    if (!(role === "admin" || role === "security" || role === "student"))
      throw "Error! Invalid Role!";
    if (!password) throw "Error! Provide Password";

    const username = email.split("@")[0];

    // Hash password & save to mongoDB
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        const newUser = new users({ email, password: hash, role, username });
        newUser
          .save()
          .then(() => {
            res.send("User Registered Successfully!");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      })
      .catch((error) =>
        res.status(422).send("Password couldn't be hashed:", error)
      );
  } catch (error) {
    res.status(422).send(error);
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    if(req.session.username){
      return res.status(400).send("Already logged in!");
    }

    const { id, password } = req.body;

    //Credential Constraints
    if (!id || !password) {
      return res.status(400).send("Error! Bad Credentials!"); 
    };

    //Search in DB
    const user = await users.findOne({
      $or: [{ email: id }, { username: id }],
    });
    if (!user) {
      return res.status(404).send("Not registered!");
    }

    //Verify Password
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (passwordCorrect) {
      req.session.username = user.username;
      return res.status(200).send(`Welcome Back ${user.name.split(" ")[0]}!`);
    } else {
      return res.status(400).send("Bad Credentials");
    }
  } catch (error) {
    return res.status(500).send(error);
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
