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
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
//authentication packages:
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

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

//the session must be placed before passport session
app.use(session(sessionConfig));
app.use(flash());

/////AUTHENTICATION
app.use(passport.initialize());
//allows persistent log-in session(via a cookie), usually
app.use(passport.session());
// for the localstrategy, the auth. method will be located in the User model (the method is added by default the passport-local-mongoose package)
passport.use(new LocalStrategy(User.authenticate()));

//serialization has to do with how we store/remove a user to a session
//adds a isAuthenticated() property to the req object itself
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////LOCALS
//works for every single request, needs to be placed before the routes
//note that the locals property makes the value assigned to it be available to all templates that are rendered
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  //req.user is an object with current user info,
  //provided by passport
  res.locals.currentUser = req.user;
  next();
});

/*----------------------- ROUTES ----------------------*/

app.get("/fakeuser", async (req, res) => {
  const user = new User({ email: "me@gmail.com", username: "me" });
  //register meth also provded by pas-loc-mon;
  //hashes the passwrd and save user to mongdb
  const newuser = await User.register(user, "rabannette");
  res.send(newuser);
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

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
