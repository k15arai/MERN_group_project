const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: (req, res) => {
    const user = new User(req.body);

    user
      .save()
      .then((newUser) => {
        console.log(newUser);
        console.log("Registration successful");
        res.json({
          successMessage: "Thank you for registering",
          user: newUser,
        });
      })
      .catch((err) => {
        console.log("register not successful");
        res.status(400).json(err);
      });
  },

  login: (req, res) => {
    User.findOne({ email: req.body.email })
      .then((userRecord) => {
        if (userRecord === null) {
          res.status(400).json({ message: "Invalid login attempt" });
        } else {
          bcrypt
            .compare(req.body.password, userRecord.password)
            .then((isPasswordValid) => {
              if (isPasswordValid) {
                console.log("password is valid");
                res
                  .cookie(
                    "usertoken",
                    jwt.sign(
                      {
                        _id: userRecord._id,
                        email: userRecord.email,
                        firstname: userRecord.firstName,
                      },
                      process.env.JWT_SECRET
                    ),
                    {
                      httpOnly: true,
                      expires: new Date(Date.now() + 9000000),
                    }
                  )
                  .json({
                    message: "Successfully",
                    userLogged: {
                      username: `${userRecord.firstName} ${userRecord.lastName}`,
                      userId: `${userRecord._id}`,
                      userLoggedIn: `${userRecord.firstName}`,
                    },
                  });
              } else {
                res.status(400).json({
                  message: "Login and/or Email is invalid",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json({ message: "Invalid Attempt" });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: "Invalid Attempt" });
      });
  },

  logout: (req, res) => {
    console.log("logging out");
    res.clearCookie("usertoken");
    res.json({
      message: "You have successfully logged out!",
    });
  },

  getOneUser: (req, res) => {
    User.findOne({ _id: req.params.id })
      .then((oneUser) => {
        console.log(oneUser);
        res.json(oneUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  deleteOneUser: (req, res) => {
    User.deleteOne({ _id: req.params.id })
      .then((deleteConfirmation) => res.json(deleteConfirmation))
      .catch((err) =>
        res
          .status(400)
          .json({ message: "Something went wrong in delete user", error: err })
      );
  },
};
