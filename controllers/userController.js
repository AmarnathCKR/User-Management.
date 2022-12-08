const User = require("../models/user.model");

const userSignin = (req, res) => {
  if (req.session.userAuth) {
    res.redirect("/dashboard");
  } else if (req.session.adminAuth) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("userSignin");
  }
};

const userSignup = (req, res) => {
  if (req.session.userAuth) {
    res.redirect("/dashboard");
  } else {
    res.render("userSignup");
  }
};

// Create user
const insertUser = async (req, res) => {
  try {
    var userDetails = new User({
      name: req.body.userName,
      email: req.body.userEmail,
      password: req.body.userPassword,
    });
    const email = req.body.userEmail;
    const user = await User.findOne({ email: email });
    if (email === user.email) {
      res.render("userSignup", {
        error: "User already existing. Please Log in",
      });
    }
  } catch {
    const userData = userDetails.save();
    res.render("userSignup", {
      message: "User added successfully.",
    });
  }
};

// User verification
let user;
const userVerification = async (req, res) => {
  try {
    const email = req.body.userEmail;
    const password = req.body.userPassword;
    user = await User.findOne({ email: email });
    if (user) {
      if (email == user.email && password == user.password) {
        req.session.userAuth = email;
        console.log("User session created");
        res.redirect("/dashboard");
      } else {
        res.render("userSignin", {
          invalid: "Invalid Credentials",
        });
      }
    } else {
      res.render("userSignin", {
        invalid: "User not found",
      });
    }
  } catch (error) {
    console.log(" User verification error: " + error.message);
    res.render("userSignin", {
      invalid: "Invalid Credentials",
    });
  }
};

// Dashboard
const dashboard = (req, res) => {
  if (req.session.userAuth) {
    res.render("userDashboard", {
      userMail: user.email
    });
  } else {
    res.redirect("/");
  }
};

// User log out
const userLogOut = (req, res) => {
  if (req.session.userAuth) {
    req.session.destroy();
    console.log("User session destroyed");
    res.redirect("/");
    res.end();
  }else{
    res.redirect("/");
  }
};

module.exports = {
  userSignin,
  userSignup,
  insertUser,
  userVerification,
  userLogOut,
  dashboard,
};
