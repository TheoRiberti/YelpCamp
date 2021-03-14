const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author: "604a5d4e12153d263454ffaf",
      //this url is a small api at unsplash that returns a random picture from the specified collection everytime is accessed
      images: [
        {
          url:
            "https://res.cloudinary.com/ddlgml3yp/image/upload/v1615668947/YelpCamp/arx7qdpkiegivyq9ncsg.png",
          filename: "YelpCamp/arx7qdpkiegivyq9ncsg",
        },
        {
          url:
            "https://res.cloudinary.com/ddlgml3yp/image/upload/v1615668950/YelpCamp/b2glmcvclzpx2kz58n92.png",
          filename: "YelpCamp/b2glmcvclzpx2kz58n92",
        },
        {
          url:
            "https://res.cloudinary.com/ddlgml3yp/image/upload/v1615668953/YelpCamp/e9zklfmxwzdpdjefxba7.png",
          filename: "YelpCamp/e9zklfmxwzdpdjefxba7",
        },
        {
          url:
            "https://res.cloudinary.com/ddlgml3yp/image/upload/v1615668953/YelpCamp/hab7d6fuocmihrynastg.jpg",
          filename: "YelpCamp/hab7d6fuocmihrynastg",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque sapiente accusamus molestiae provident accusantium eligendi qui labore magnam, quos, omnis consequatur inventore fugiat exercitationem ipsum earum nam repudiandae necessitatibus? Repudiandae!",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
