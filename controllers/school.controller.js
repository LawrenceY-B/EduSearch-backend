const sch = require("../models/schoolModel");
const fav = require("../models/fav.model");
const User = require("../models/user");
const {
  validateSchool,
  validateFav,
  extractMail,
} = require("../services/school.service");
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN_KEY;

const AddNewSchool = async (req, res) => {
  try {
    const { error } = validateSchool(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    let schoolName = req.body.name;
    const school = await sch.find({ name: schoolName });
    if (school.length === 1)
      return res
        .status(403)
        .json({ success: false, message: "School already exists" });
    const result = sch.create({
      name: req.body.name,
      curriculum: req.body.curriculum,
      level: req.body.level,
      size: req.body.size,
      price: req.body.price,
      Location: req.body.location,
      Rating: req.body.rating,
      ImgUrl: req.body.ImgUrl,
      isSaved: false,
    });
    if (result) {
      return res
        .status(200)
        .json({ succcess: true, message: "School has been succesfully added" });
    } else {
      return res
        .status(400)
        .json({ succcess: false, message: "Couldn't add school" });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ success: false, message: "Something wrong happened here" });
  }
};
const DeleteSchool = (req, res) => {};

const AddFavorite = async (req, res) => {
  try {
    const { error } = validateFav(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const name = req.body.name;
    const status = req.body.isSaved;
    let schoolname = {
      name: name,
    };
    const school = await sch.findOneAndUpdate(
      schoolname,
      { isSaved: status },
      { new: true }
    );
    if (!school) {
      res.status(400).json({ mesages: "School not found" });
    }

    if (school.isSaved == true) {
      let userEmail = extractMail(req, res);
      const user = User
      user.findOne({ email: userEmail });
      if (!user) {
        res.status(401).json({ mesages: "user not found" });
      }

      //add new favorites
      const favoriteItem = new fav({ User: user._id, School: school._id });
      favoriteItem.save()

      //save to user favorite array
      if (!user.Favorites) {
        user.Favorites = [];
      }
      //add the favorite item ID to the user's favorite array
      user.Favorites.push(favoriteItem._id);
      user.save()
      //it is not saving :( worko on bugs later
      //check to see if scchool is alreday in favorites
      res.status(200).json({ mesages: "Favorite added successfully" });
    } else if (school.isSaved == false) {
      let favoriteItem = await fav.findOneAndDelete({ School: school._id });
      res.status(200).json({ mesages: "Favorite deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const DeleteFavorite = async (req, res) => {
  try {
    const { error } = validateFav(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const Schname = req.body.name;
    fav.findOneAndDelete({ name: Schname }, (err, deletedUser) => {
      if (err) {
        res.status(400).json({ success: false, message: "Couldn't delete" });
      } else {
        res
          .status(200)
          .json({ success: true, message: `Deleted user: ${deletedUser}` });
      }
    });
  } catch (e) {
    return res
      .status(400)
      .json({ success: false, message: "Oops! Something went wrong" });
  }
};

const GetSearchResults = async (req, res) => {};
module.exports = {
  AddNewSchool,
  DeleteSchool,
  AddFavorite,
  DeleteFavorite,
  GetSearchResults,
};
