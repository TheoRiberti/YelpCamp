const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    //this is not considered as a validation (so cannot be used as a validation for a middlware ??)
    unique: true,
  },
});

//this automatically adds on to our schema functionality like user name, password, makes sure that usernames are unique, all behind the scenes..
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
