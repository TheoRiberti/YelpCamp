const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

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
  for (let i = 0; i < 250; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const randomCity = cities[random1000];
    const camp = new Campground({
      location: `${randomCity.city}, ${randomCity.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author: "604a5d4e12153d263454ffaf",
      //this url is a small api at unsplash that returns a random picture from the specified collection everytime is accessed
      images: [
        {
          url:
            "https://res.cloudinary.com/ddlgml3yp/image/upload/v1616167011/YelpCamp/sry9mnmr48i6jyoir9ei.jpg",
          filename: "YelpCamp/sry9mnmr48i6jyoir9ei",
        },
        {
          url:
            "https://res.cloudinary.com/ddlgml3yp/image/upload/v1615784032/YelpCamp/gun9df9lqdizcpju3qkq.jpg",
          filename: "YelpCamp/gun9df9lqdizcpju3qkq",
        },
        {
          url:
            "https://res.cloudinary.com/ddlgml3yp/image/upload/v1615804992/YelpCamp/iexokdch4degygmgt9qr.jpg",
          filename: "YelpCamp/iexokdch4degygmgt9qr",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque sapiente accusamus molestiae provident accusantium eligendi qui labore magnam, quos, omnis consequatur inventore fugiat exercitationem ipsum earum nam repudiandae necessitatibus? Repudiandae!",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [randomCity.longitude, randomCity.latitude],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
