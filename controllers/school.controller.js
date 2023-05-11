const sch = require("../models/schoolModel");
const Favorite = require("../models/fav.model");
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
    const {name} = req.body;
    const schoolname = {
      name: name,
    };
    const school = await sch.findOne(schoolname);
    if (!school) {
      res.status(400).json({ mesages: "School not found" });
    }

    let userEmail = extractMail(req, res);

    const userDetails = await User.findOne({ Email: userEmail });
    if (!userDetails) {
      res.status(401).json({ mesages: "User not found" });
    }

    //add new favorites
    const existing = await Favorite.find({ School: school._id });
    if (existing.length === 1)
      return res
        .status(403)
        .json({ success: false, message: "School is already in favorites" });

    let result = await Favorite.create({
      UserData: userDetails._id,
      School: school._id,
    });

    const Saved = await User.findOne({ Email: userEmail });
    Saved.Favorites.push(result._id);
    await Saved.save();
    
   if(!Saved) {
    throw new Error("School could not be saved")
   }
   else {res.status(200).json({ success: true, message:" School has been saved"})}

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
const GetFavorite= async (req, res) => {
try {
  const userEmail= extractMail(req,res);
  if(!userEmail) {res.status(401).json({ success: false, message:"Unauthorized"})}
  let userfavorites= await User.findOne({ Email: userEmail}).populate('Favorites.Users')
  if(!userfavorites){
    res.status(404).json({success: false, message:"Error while fetching favorites"})
  }else{res.status(201).json({success:true, favorites:userfavorites})}
} catch (error) {
  res.status(500).json({success: false, message: error.message || "Something went wrong"})
}
};
const DeleteFavorite = async (req, res) => {
  // try {
  //   const { error } = validateFav(req.body);
  //   if (error)
  //     return res
  //       .status(400)
  //       .json({ success: false, message: error.details[0].message });
  //   const Schname = req.body.name;
  //   Favorite.findOneAndDelete({ name: Schname }, (err, deletedUser) => {
  //     if (err) {
  //       res.status(400).json({ success: false, message: "Couldn't delete" });
  //     } else {
  //       res
  //         .status(200)
  //         .json({ success: true, message: `Deleted user: ${deletedUser}` });
  //     }
  //   });
  // } catch (e) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Oops! Something went wrong" });
  // }
};

const GetSearchResults = async (req, res) => {};
module.exports = {
  AddNewSchool,
  DeleteSchool,
  AddFavorite,
  DeleteFavorite,
  GetFavorite,
  GetSearchResults,
};
//  //it is not saving :( worko on bugs later
//       //check to see if scchool is alreday in favorites
//       res.status(200).json({ mesages: "Favorite added successfully" });

//       await Favorite.findOneAndDelete({ School: school._id });
//       // const userDetails = await User.findOne({ Email: userEmail });

//       // userDetails.Favorites.pop(result._id);
//       // userDetails.save();

//       res.status(200).json({ mesages: "Favorite deleted successfully" });
