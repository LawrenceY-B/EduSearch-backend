const sch = require("../models/schoolModel");
const Favorite = require("../models/fav.model");
const User = require("../models/user");
const {
  validateFav,
  extractMail,
  validateQuery,
  validateSchoolQuery,
} = require("../services/school.service");
const jwt = require("jsonwebtoken");
const Sch = require("../models/schoolModel");
const tokenkey = process.env.TOKEN_KEY;

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
      throw new Error("School not found");
    }

    let userData = extractMail(req, res);
    let userEmail = userData.userEmail;
    let userID = userData.userId;
    //check if userexists
    const userDetails = await User.findOne({ _id: userID });
    if (!userDetails) {
      throw new Error("User not found");
    }

    const existing = await Favorite.findOne({ UserData: userID })
      .where("School")
      .equals(school._id);
    if (existing) throw new Error("School is already in favorites");
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
      throw new Error("Unauthorized");
    }
    let userfavorites = await User.findOne({ Email: userEmail })
      .populate({
        path: "FavoriteSchools",
        populate: {
          path: "School",
          options: { strictPopulate: false },
        },
      })
      .select("-Password -Email -Phonenumber");
    // console.log(userfavorites)
    if (!userfavorites) {
      throw new Error("Error while getting favorites");
    } else {
      res
        .status(201)
        .json({
          success: true,
          message: "Keep an eye on your favorite schools! 👀",
          favorites: userfavorites,
        });
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
    next(err);
  }
};

//then add multer and go through aws s3 sdk
const GetSearchResults = async (req, res, next) => {
  try {
    const { error } = validateQuery(req.query);
    if (error) {
      throw new Error(error.details[0].message);
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

    const serializedcurriculum = JSON.parse(decodeURIComponent(curriculum));
    const serializedlevel = JSON.parse(decodeURIComponent(level));
    const serializedbackground = JSON.parse(decodeURIComponent(background));
    let minSize = parseInt(minsize);
    // console.log(serializedcurriculum+" "+serializedlevel+" "+serializedbackground);
    const search = sch.find({
      Curriculum: { $in: serializedcurriculum },
      Level: { $in: serializedlevel },
      Size: { $gte: minSize, $lte: maxsize },
      Background: { $in: serializedbackground },
      Price: { $gte: minprice, $lte: maxprice },
    });

    if (rating) {
      search.where("Rating").equals(rating);
    }

    if (location) {
      search.where("Location").equals(location);
    }

    const results = await search.exec();
    //read on pagination and skipcount
    if (results.length === 0) {
      throw new Error("No results found");
    } else {
      res.status(200).json({
        success: true,
        message: `Found ${results.length} results`,
        data: results,
      });
    }
  } catch (error) {
    next(error);
  }
};

const SearchSchool = async (req, res, next) => {
  try {
    const { error } = validateSchoolQuery(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const { school } = req.body;
    console.log(school);
    const result = await sch.find({ Name: school });
    console.log(result);
    if (result.length <1 || !result) {
      return res
        .status(400)
        .json({ success: false, message: " Something went wrong" });
    }
    return res
      .status(200)
      .json({ success: true, message: "School has been found", data: result });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  AddFavorite,
  DeleteFavorite,
  GetFavorite,
  GetSearchResults,
  SearchSchool,
};
