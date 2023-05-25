const express = require("express");
const {AddFavorite, DeleteFavorite,GetFavorite, GetSearchResults}= require("../controllers/school.controller");
const {AddNewSchool,AddAdditionalData}= require("../controllers/schAdmincontroller")

const {verifyToken}= require("../middleware/isAuth");

const router = express.Router();
//admin functionality
router.post("/admin/add-school", AddNewSchool),
router.post("/admin/add-school/additional-data", AddAdditionalData)

//user functionality
router.post("/user/add-favorite",verifyToken, AddFavorite),
router.delete("/user/delete-favorite", DeleteFavorite),
router.get("/user/get-favorite", GetFavorite),
router.get("/user/getresults", verifyToken, GetSearchResults),



module.exports = router;