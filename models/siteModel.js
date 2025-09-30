const Joi = require("joi");
const mongoose = require("mongoose");

let siteSchema = new mongoose.Schema({
  name: String,
  url: String,
  image: String,
  score: Number,
});

exports.siteModel = mongoose.model("sites", siteSchema);

exports.validatesite = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).required(),
    url: Joi.string().min(5).max(200).required(),
    image: Joi.string().min(5).max(300).required(),
    score: Joi.number().min(0).max(10).required(),
  });
  return joiSchema.validate(_reqBody);
};
