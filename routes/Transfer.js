const express = require("express");
const {
  available,
  
} = require("../controllers/Trans");
const router = express.Router();

router.get("/transfer", available);
module.exports = router;