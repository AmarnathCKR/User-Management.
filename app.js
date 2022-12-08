require("./models/db");
const express = require("express");
const app = express();
const path = require("path");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const { nextTick } = require("process");

const port = 3000;

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  sessions({
    secret: "secret-key-hjddfjh",
    saveUninitialized: true,
    resave: false,
  })
);

app.use( (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
})

app.use(cookieParser());

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log("Lisening on http://127.0.0.1:3000");
});
