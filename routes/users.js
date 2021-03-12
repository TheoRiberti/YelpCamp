const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
const users = require("../controllers/users");

router
  .route("/register")
  //renders reg. user form
  .get(users.renderRegisterForm)
  //register new user
  .post(catchAsync(users.register));

router
  .route("/login")
  //renders user login form
  .get(users.renderLogin)
  //user login send form
  .post(
    //local is the strategy,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
