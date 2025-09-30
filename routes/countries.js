const express = require("express");
const router = express.Router();
const { countryModel, validateCountry } = require("../models/countryModel");
const { auth } = require("../middlewares/auth");

router.get("/", auth, async (req, res) => {
  try {
    let data = await countryModel.find({ user_id: req.token._id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "There is a problem, try again later", err });
  }
});

router.post("/", auth, async (req, res) => {
  let validBody = validateCountry(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user_id = req.token._id;
    let country = new countryModel({ ...req.body, user_id });
    await country.save();
    res.status(201).json(country);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem, try again later", err });
  }
});

router.put("/:id", auth, async (req, res) => {
  let validBody = validateCountry(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let id = req.params.id;
        let tokenId = req.token._id;
        let country = await countryModel.findOne({ _id: id });
        if (!country) {
            return res.status(404).json({ message: "Country not found" });
        }
        if (country.user_id !== tokenId) {
            return res.status(403).json({ message: "Not authorized" });
        }
        let data = await countryModel.updateOne({ _id: id }, req.body);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "There is a problem, try again later", err });
    }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let tokenId = req.token._id;
    let country = await countryModel.findOne({ _id: id });
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    if (country.user_id !== tokenId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    let result = await countryModel.deleteOne({ _id: id });
    res.json(result);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem, try again later", err });
  }
});

module.exports = router;