const express = require("express");
const AddNewSchool = require("../controllers/Sch.controller");
const router = express.Router();

router.post("/admin/add-school", AddNewSchool);



module.exports = router;