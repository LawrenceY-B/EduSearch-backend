const express = require("express");
const { Addnewuniversity, Addcourses, GetAllCourses } = require("../controllers/UniAdminController");
const { verifyUniAdmin,verifyToken } = require("../middleware/isAuth");
const { searchCourses, getSkills } = require("../controllers/university.controller");


const router = express.Router();
router.post("/admin/addnewuniversity",verifyUniAdmin ,Addnewuniversity);
router.post("/admin/addcourses",verifyUniAdmin ,Addcourses);
router.get("/admin/getalluniversities",verifyUniAdmin ,GetAllCourses);

router.get("/user/searchcourses",verifyToken,searchCourses);
router.get("/user/getskills",getSkills);
module.exports = router;