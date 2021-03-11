const express = require("express");
const router = express.Router();
//the wrapper helper funcion to catch errors:
const catchAsync = require("../utils/catchAsync");
//our customized error class:
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
//dont forget to destructure when importing stuff...
const { isLoggedIn } = require("../middleware");
//joi schema validation for using in the validateCamground mdware,
const { campgroundSchema } = require("../schemas");

//defining middleware for validation via joi
const validateCampground = (req, res, next) => {
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
    let campground = await Campground.findById(id).populate("reviews");
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", { campground });
    }
  })
);

//rest route: update, updates specific camp to server
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//rest route: destroy, deletes specific camp to server
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
