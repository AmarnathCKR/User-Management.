const User = require("../models/user.model");

const adminSignin = (req, res) => {
  if (req.session.adminAuth) {
    res.redirect("/dashboard");
  } else {
    res.render("adminsignin");
  }
};

const adminDetails = {
  email: "adminMail@gmail.com",
  password: "adminPassword",
};

// Admin verification
const adminVerification = (req, res) => {
  try {
    const email = req.body.adminEmail;
    const password = req.body.adminPassword;
    if (req.body) {
      if (email == adminDetails.email && password == adminDetails.password) {
        req.session.adminAuth = email;
        console.log("Admin session created");
        res.redirect("/admin/dashboard");
      } else {
        res.render("adminSignin", {
          invalid: "Invalid Credentials",
        });
      }
    } else {
      res.render("adminSignin", {
        invalid: "Admin not found",
      });
    }
  } catch (error) {
    console.log(" Admin verification error: " + error.message);
    res.render("adminSignin", {
      invalid: "Invalid Credentials",
    });
  }
};

// Dashboard
const adminDashboard = (req, res) => {
  if (req.session.adminAuth) {
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    const userDetails = User.find(
      {
        $or: [
          { name: { $regex: "^" + search + ".*", $options: "i" } },
          { email: { $regex: "^" + search + ".*", $options: "i" } },
        ],
      },
      (err, Users) => {
        res.render("adminDashboard", { details: Users });
      }
    ).sort({datefield: -1})
  } else {
    res.redirect("/admin/Signin");
  }
};

// Add user page
const addUserPage = (req, res) => {
  if (req.session.adminAuth) {
    res.render("adminCreate");
  } else {
    res.redirect("/admin/Signin");
  }
};

// Admin create user
const addUser = async (req, res) => {
  try {
    var userDetails = new User({
      name: req.body.userName,
      email: req.body.userEmail,
      password: req.body.userPassword,
    });
    const email = req.body.userEmail;
    const user = await User.findOne({ email: email });
    if (email === user.email) {
      res.render("adminCreate", {
        error: "User already existing. Please Log in",
      });
    }
  } catch {
    const userData = userDetails.save();
    res.redirect("/admin/dashboard");
  }
};

// Edit user
const editUser = async (req, res) => {
  if (req.session.adminAuth) {
    try {
      const userID = req.query.id;
      const userDetails = User.findById({ _id: req.query.id }).then(
        (result) => {
          res.render("adminEdit", {
            details: result,
          });
        }
      );
    } catch (error) {
      console.log("Edit user error: " + error.message);
    }
  } else {
    res.redirect("/admin/signin");
  }
};

// After editing by admin
const adminEdited = async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { email: req.body.userEmail },
      {
        $set: {
          name: req.body.userName,
          email: req.body.userEmail,
          password: req.body.userPassword,
        },
      }
    );
    console.log();
    res.redirect("/dashboard");
  } catch (error) {
    console.log("User edit error: " + error.message);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  if (req.session.adminAuth) {
    try {
      const userData = await User.findByIdAndDelete({ _id: req.query.id });
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log("User deleting error: " + error.message);
    }
  } else {
    res.redirect("/admin/signin");
  }
};

// Admin Logout
const adminLogOut = (req, res) => {
  req.session.destroy();
  console.log("Admin session destroyed");
  res.redirect("/admin/signin");
  res.end();
};

module.exports = {
  adminSignin,
  adminVerification,
  adminLogOut,
  adminDashboard,
  addUser,
  addUserPage,
  deleteUser,
  editUser,
  adminEdited,
};
