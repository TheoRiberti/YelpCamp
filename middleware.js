module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //this is awesome, could put anything in the section, store any value, here we assing the full path of the url we are trying to reach but couldn't cause not logged in..
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first");
    res.redirect("/login");
  } else {
    next();
  }
};
