const express = require("express");
const { Addnewuniversity, Addcourses } = require("../controllers/UniController");
const { verifyUniAdmin } = require("../middleware/isAuth");


const router = express.Router();

router.post("/user/addnewuniversity",verifyUniAdmin ,Addnewuniversity);
router.post("/user/addcourses",verifyUniAdmin ,Addcourses);
module.exports = router;