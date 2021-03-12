const express = require("express");
//the option mergeParams is set to true so the reviews can access the params from the app.js, otherwise the req.params'd be an empty object
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

//creates a review for a particular campground
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//route: delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
