const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//if i have doubt about it look at the cloudinary docs:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//sets up an instance of cloudinarystorage
const storage = new CloudinaryStorage({
  //passes in the cloudinary obj configured above
  cloudinary,
  params: {
    //folder in cloudnry where we're going to store our stuff
    folder: "YelpCamp",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = { cloudinary, storage };
