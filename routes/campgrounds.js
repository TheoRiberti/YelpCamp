const express = require("express");
const router = express.Router();
//the wrapper helper funcion to catch errors:
const catchAsync = require("../utils/catchAsync");
//our customized error class:
const Campground = require("../models/campground");
//dont forget to destructure when importing stuff...
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
//joi schema validation for using in the validateCamground mdware,

//rest route: index, display all campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    //uses mangoose to find all items in the collection
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//rest rout: new, add a new camp, only renders the form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//rest route: create, creates new camp
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user;
    await campground.save();
    //if we made it till this point there's no error thrown..
    req.flash("success", "Successfully created new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//remember to leave this one as the last one
//rest route: show, details for a specific camp
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    //uses mangoose to find all items in the collection
    const { id } = req.params;
    //this weird syntax below is for grabbing the author from the review
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/show", { campground });
    }
  })
);

//rest route: edit, renders form to edit a camp
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

//rest route: update, updates specific camp to server
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = Campground.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);
  })
);

//rest route: destroy, deletes specific camp to server
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
