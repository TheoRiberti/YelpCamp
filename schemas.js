//THIS FILE CONTAINS SCHEMAS RELATIVE TO JS DATA VALIDATION, THROUGH JOI MIDDWARE, BEFORE MANGOOSE

//package for server side js data validation before data entering db
const Joi = require("joi");

//defines 'joi' schema for data val
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5),
  }).required(),
});
