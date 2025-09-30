const express = require("express");
const router = express.Router();
const { siteModel, validatesite } = require("../models/siteModel");

router.get("/", async (req, res) => {
  let page = parseInt(req.query.page) || 1;

  let perPage = Math.min(20, parseInt(req.query.perPage)) || 4;
  console.log(req.query);
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let data = await siteModel
      .find({})
      .sort({ [sort]: reverse })
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.json(data);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem try again later", err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await siteModel.findOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem try again later", err });
  }
});

router.post("/", async (req, res) => {
  let validBody = validatesite(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details);
    return;
  }
  try {
    let newSite = new siteModel(req.body);
    await newSite.save();
    res.status(201).json(newSite);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem try again later", err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await siteModel.deleteOne({ _id: id });
    res.json(result);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem try again later", err });
  }
});

router.put("/:id", async (req, res) => {
  let validBody = validatesite(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details);
    return;
  }
  try {
    let id = req.params.id;
    let data = req.body;
    let result = await siteModel.updateOne({ _id: id }, data);
    res.json(result);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem try again later", err });
  }
});

module.exports = router;
