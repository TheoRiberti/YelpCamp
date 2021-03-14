const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
//no needs to specify index.js as node automatically looks for index.js in the folder
const { storage } = require("../cloudinary");

const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  //index, display all campgrounds
  .get(catchAsync(campgrounds.index))
  //creates new camp
  .post(
    isLoggedIn,
    //for now we need to run multer midware before the validating as multer adds the stuff to the req.body that joi uses to validate
    upload.array("image"),
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
    upload.array("image"),
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
