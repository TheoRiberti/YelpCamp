const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
  .route("/")
  //index, display all campgrounds
  .get(catchAsync(campgrounds.index))
  //creates new camp
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

//renders new camp form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  //show details for a camp
  .get(catchAsync(campgrounds.showCampground))
  //updates a camp
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  //destro camp
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//renders edit camp form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
