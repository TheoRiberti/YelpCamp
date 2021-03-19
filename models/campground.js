const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//res.cloudinary.com/demo/image/upload/w_150,c_scale/sample.jpg

//this allows virtual properties to be passed when converted to json format
const opts = { toJSON: { virtuals: true } };

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_150,c_scale");
});

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    //standard geojson confs taken from mongoose docs
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  const briefDescription = this.description.slice(0, 72);
  return `<h6><a href="/campgrounds/${
    this._id
  }">${this.title}</a></h6><p><strong>${this.location}</strong></p><p>${briefDescription}...</p><img class="img-fluid" src="${this.images[0] ? this.images[0].thumbnail : ""}"/>`;
});

//

//mongoose query middleware to delete all reviews associated to a campground ----note that if the way a campground is deleted is changed, like instead of "findByIdAndDel..." replaceing by the remove method or delete many.., this midware'd stop working
CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews.length) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
