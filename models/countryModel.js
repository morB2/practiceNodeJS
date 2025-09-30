const mongoose = require("mongoose");
const Joi = require("joi");

const countrySchema = new mongoose.Schema({
  name: String,
  capital: String,
  pop: Number,
  img: String,

  date: {
    type: Date,
    default: Date.now,
  },
  user_id: String,
});

exports.validateCountry = (_bodyData) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        capital: Joi.string().min(2).max(99).required(),
        pop: Joi.number().min(0).max(1000000000).required(),
        img: Joi.string().min(2).max(999).required(),
    });
    return joiSchema.validate(_bodyData);
}

exports.countryModel = mongoose.model("countries", countrySchema);
