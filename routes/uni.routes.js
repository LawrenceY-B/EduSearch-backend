const express = require("express");
const { Addnewuniversity } = require("../controllers/UniController");

const router = express.Router();

router.post("/user/addnewuniversity", Addnewuniversity);
module.exports = router;