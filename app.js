const express = require("express");
const path = require("path");
const Campground = require("./models/campground");
const mongoose = require("mongoose");
//don't forget to npm i method-override
const methodOverride = require("method-override");
//ejs-mate is an engine used to parse ejs code
const ejsMate = require("ejs-mate");

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

/*----------------------- ROUTES ----------------------*/

app.get("/", (req, res) => {
  res.render("home");
});

//rest route: index, display all campgrounds
app.get("/campgrounds", async (req, res) => {
  //uses mangoose to find all items in the collection
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//rest rout: new, add a new camp, only renders the form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//rest route: create, creates new camp
app.post("/campgrounds", async (req, res) => {
  //can use req.body.campground because of the squarebracked usage in the name, i believe..
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

//rest route: edit, renders form to edit a camp
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

//rest route: update, updates specific camp to server
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

//rest route: destroy, deletes specific camp to server
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

//remember to leave this one as the last <one className=""></one>
//rest route: show, details for a specific camp
app.get("/campgrounds/:id", async (req, res) => {
  //uses mangoose to find all items in the collection
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

app.listen(3000, () => {
  console.log("Serving on port 3000!");
});
