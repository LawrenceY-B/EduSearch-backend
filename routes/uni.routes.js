const express = require("express");
const { Addnewuniversity, Addcourses, GetAllCourses } = require("../controllers/UniController");
const { verifyUniAdmin } = require("../middleware/isAuth");


const router = express.Router();

router.post("/user/addnewuniversity",verifyUniAdmin ,Addnewuniversity);
router.post("/user/addcourses",verifyUniAdmin ,Addcourses);
router.get("/user/getalluniversities",verifyUniAdmin ,GetAllCourses);
module.exports = router;