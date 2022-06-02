const express = require("express");
const {
  AddNewUser,
  login,
  logout,
  verifyNumber,
  forgotPassword,
  resendOTP
} = require("../controllers/Auth");
const router = express.Router();

router.post("/signup", AddNewUser);
router.post("/login", login);
router.post("/verifynumber", verifyNumber);
router.post('/resendotp', resendOTP)
router.delete("/logout", logout);
router.post("/forgotpassword", forgotPassword);


module.exports = router;
