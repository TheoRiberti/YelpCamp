const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//mongoose query middleware to delete all reviews associated to a campground ----note that if the way a campground is deleted is changed, like instead of "findByIdAndDel..." replaceing by the remove method or delete many.., this midware'd stop working
CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews.length) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
