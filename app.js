const express = require("express");
const path = require("path");
const Campground = require("./models/campground");
const mongoose = require("mongoose");
//don't forget to npm i method-override
const methodOverride = require("method-override");
//ejs-mate is an engine used to parse ejs code, it allows boilerplate usage
const ejsMate = require("ejs-mate");
//the wrapper helper funcion to catch errors:
const catchAsync = require("./utils/catchAsync");
//our customized error class:
const ExpressError = require("./utils/ExpressError");
//joi schema validation for using in the validateCamground mdware, destructuring as we plan to have multiple schemas in this file
const { campgroundSchema } = require("./schemas");
/*-----------------------INITIAL SETUP----------------------*/

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

//tells express to use ejs-mate as the engine to parse ejs code
//instead of the default one
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//allows POST routes reading from url body
app.use(express.urlencoded({ extended: true }));

///middlerware  to allow html forms working with patch/put/delete
app.use(methodOverride("_method"));

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

/*----------------------- ROUTES ----------------------*/

app.get("/", (req, res) => {
  res.render("home");
});

//rest route: index, display all campgrounds
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    //uses mangoose to find all items in the collection
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//rest rout: new, add a new camp, only renders the form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//rest route: create, creates new camp
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // //can use req.body.campground because of the squarebracked usage in the name, i believe..
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//rest route: edit, renders form to edit a camp
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

//rest route: update, updates specific camp to server
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//rest route: destroy, deletes specific camp to server
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

//remember to leave this one as the last <one className=""></one>
//rest route: show, details for a specific camp
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    //uses mangoose to find all items in the collection
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

//catches all invalid paths, of course it needs to be at the end
app.all("*", (req, res, next) => {
  //generating our customized situation:
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh No, Something Went Wrong!";
  } //render error tempalate
  console.log(statusCode);
  res.status(statusCode).render("error", { err });
  //console.dir(err);
});

app.listen(3000, () => {
  console.log("Serving on port 3000!");
});
