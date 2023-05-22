const sch = require("../models/schoolModel");
const Favorite = require("../models/fav.model");
const User = require("../models/user");
const {
  validateSchool,
  validateFav,
  extractMail,
  validateQuery,
} = require("../services/school.service");
const jwt = require("jsonwebtoken");
const Sch = require("../models/schoolModel");
const tokenkey = process.env.TOKEN_KEY;

const AddNewSchool = async (req, res) => {
  try {
    const { error } = validateSchool(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const {
      name,
      email,
      phone,
      curriculum,
      level,
      size,
      background,
      ImgUrl,
      price,
      rating,
      location,
    } = req.body;
    const Phonenumber = phone.replace(phone.slice(0, 1), "233");
    const school = await sch.find({ Name: name });
    if (school.length === 1)
      return res
        .status(403)
        .json({ success: false, message: "School already exists" });
    const result = sch.create({
      Name: name,
      Email: email,
      Phone: Phonenumber,
      Curriculum: curriculum,
      Level: level,
      Size: size,
      Background: background,
      ImgUrl: ImgUrl,
      Price: price,
      Rating: rating,
      Location: location,
      IsVerified: false,
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
    return res.status(400).json({ success: false, message: e.message });
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
    const { name } = req.body;
    const schoolname = {
      Name: name,
    };
    const school = await sch.findOne(schoolname);
    //check if school exists
    if (!school) {
      res.status(400).json({ mesages: "School not found" });
    }

    let userData = extractMail(req, res);
    let userEmail = userData.userEmail;
    let userID = userData.userId;
    //check if userexists
    const userDetails = await User.findOne({ _id: userID });
    if (!userDetails) {
      res.status(401).json({ mesages: "User not found" });
    }

    const existing = await Favorite.findOne({ UserData: userID })
      .where("School")
      .equals(school._id);
    if (existing)
      return res
        .status(403)
        .json({ success: false, message: "School is already in favorites" });

    let result = await Favorite.create({
      UserData: userDetails._id,
      School: school._id,
    });

    const addFavorite = await User.findOne({ Email: userEmail });
    addFavorite.FavoriteSchools.push(result);
    await addFavorite.save();

    if (!addFavorite) {
      throw new Error("School could not be saved");
    } else {
      res
        .status(200)
        .json({ success: true, message: " School has been saved" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
const GetFavorite = async (req, res) => {
  try {
    const userData = extractMail(req, res);
    let userEmail = userData.userEmail;
    if (!userEmail) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
    let userfavorites = await User.findOne({ Email: userEmail }).populate({
      path: "FavoriteSchools",
      populate: {
        path: "School",
        options: { strictPopulate: false },
      },
    });

    if (!userfavorites) {
      res
        .status(404)
        .json({ success: false, message: "Error while fetching favorites" });
    } else {
      res.status(201).json({ success: true, favorites: userfavorites });
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
    const { name: Schname } = req.body;
    let schoolID = await Sch.findOne({ Name: Schname });
    if (!schoolID) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }
    schoolID = schoolID._id;
    const userData = extractMail(req, res);
    let userIdentifier = userData.userId;
    const DeleteFav = await Favorite.findOne({ UserData: userIdentifier });
    if (!DeleteFav) {
      res.status(404).json({ message: "User not found" });
    } else {
      const result = await Favorite.findOneAndDelete({ School: schoolID });
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Favorite not found" });
      }
      const userId = result.UserData;
      let user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Couldn't find user" });
      }
      user.FavoriteSchools = user.FavoriteSchools.filter(
        (favoriteId) => favoriteId.toString() !== result._id.toString()
      );

      await user.save();

      res.status(200).json({ success: true, message: `Deleted favorite` });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Oops! Something went wrong" });
  }
};
//work on getsearch results
//learn how to do queries

//then add multer and go though aws s3 sdk
const GetSearchResults = async (req, res) => {
  try {
    const { error } = validateQuery(req.query);
    if (error) {
      res.status(401).json({ message: error.message });
    }
    const {
      curriculum,
      level,
      minsize,
      maxsize,
      background,
      minprice,
      maxprice,
      rating,
      location,
    } = req.query;
    const search = await sch
      .find()
      .where("Curriculum")
      .equals(curriculum)
      .where("Level")
      .equals(level)
      .where("Size")
      .gte(minsize)
      .lte(maxsize)
      .where("Background")
      .equals(background)
      .where("Price")
      .gte(minprice)
      .lte(maxprice);

    if (rating) {
     await search.where("Rating").equals(rating);
    }
    if (location) {
     await search.where("Location").equals(location);
    }
//read on pagination and skipcount
    if (search.length === 0 ) {
      res.status(404).json({ success: false, message: "No Search Found" });
    }
    else{
      res.status(200).json({ success: true, mesages: search });
    }
    console.log(search.length);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  AddNewSchool,
  DeleteSchool,
  AddFavorite,
  DeleteFavorite,
  GetFavorite,
  GetSearchResults,
};
