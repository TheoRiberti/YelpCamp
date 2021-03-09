const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
//don't forget to npm i method-override
const methodOverride = require("method-override");
//ejs-mate is an engine used to parse ejs code, it allows boilerplate <usage> </usage>
const ejsMate = require("ejs-mate");
//the wrapper helper funcion to catch errors:
const catchAsync = require("./utils/catchAsync");
//our customized error class:
const ExpressError = require("./utils/ExpressError");
//joi schema validation for using in the validateCamground mdware,
//the review model:
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");

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

//allows serving public directory, public is the name of the folder cont. the assets
app.use(express.static(path.join(__dirname, "public")));

///configuring sessions:
const sessionConfig = {
  secret: "pindamonhangaba",
  resave: false,
  saveUninitialized: true,
  cookie: {
    //helps prev. xss attacks, cookie cannot be read by client
    httpOnly: true,
    //in ms
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(flash());

//works for every single request, needs to be placed before the routes
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

/*----------------------- ROUTES ----------------------*/

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("home");
});

//catches all invalid paths, of course it needs to be at the end
app.all("*", (req, res, next) => {
  //generating our customized situation:
  //I don't the reason why this code is running everytime i go to the /campgrounds page, see that later
  next(new ExpressError("Page not found", 404));
  // console.log("hello");
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh No, Something Went Wrong!";
  } //render error tempalate
  // console.log(statusCode);
  // console.log(err);
  res.status(statusCode).render("error", { err });
  //console.dir(err);
});

app.listen(3000, () => {
  console.log("Serving on port 3000!");
});
