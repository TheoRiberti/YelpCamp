const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

//note, the 'next' in the async func was only included because req.login requires a callback that calls next with a - very unlikely - error to be passed on..
module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You have logged out");
  res.redirect("/campgrounds");
};
