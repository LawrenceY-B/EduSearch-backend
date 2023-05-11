const express = require("express");
const {AddNewSchool,AddFavorite, DeleteFavorite,GetFavorite}= require("../controllers/school.controller")
const router = express.Router();

router.post("/admin/add-school", AddNewSchool),
router.post("/user/add-favorite", AddFavorite),
router.delete("/user/delete-favorite", DeleteFavorite),
router.get("/user/get-favorite", GetFavorite),



module.exports = router;