const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");

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

//defining middleware for validation via joi
//used by in campground routes
module.exports.validateCampground = (req, res, next) => {
  //const result = campgroundSchema.validate(req.body);
  //console.log(result);
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    //details is an array of objects..
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    //it's absolutelly necessary to call next so it passes the request to the next midware
    next();
  }
};

//midware to chech if the the currentUser is the author of the camp. so they can delete of update it
//used in campground routes
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found");
    res.redirect("/campgrounds");
  } else if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have the permission to do that");
    res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};

//defining middleware for validation via joi
//used in reviews routs
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//midware to chech if the the currentUser is the author of the review. so they can delete of update it
//used in review delete routes
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    res.redirect(`/campgrounds/${id}`);
  } else if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have the permission to do that");
    res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};
