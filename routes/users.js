const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

//register new user
router.post(
  "/register",
  //note, the 'next' in the async func was only included because req.login requires a callback that calls next with a - very unlikely - error to be passed on..
  catchAsync(async (req, res, next) => {
    //res.send(req.body);
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      //the req.login func requires a callback:
      req.login(registeredUser, (e) => {
        if (e) {
          next(e);
        } else {
          req.flash("success", "Welcome to Yelp Camp");
          res.redirect("/campgrounds");
        }
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

//user login form
router.get("/login", (req, res) => {
  res.render("users/login");
});

//user login send form
router.post(
  "/login",
  //local is the strategy,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have logged out");
  res.redirect("/campgrounds");
});

module.exports = router;
