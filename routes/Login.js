const express = require("express");
const {
  AddNewUser,
  login,
  logout,
  verifyNumber,
  forgotPassword,
  changePassword,
  resendOTP
} = require("../controllers/Auth");
const router = express.Router();

router.post("/signup", AddNewUser);
router.post("/login", login);
router.post("/verifynumber", verifyNumber);
router.post('/resendotp', resendOTP)
router.delete("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/changepassword", changePassword);

module.exports = router;
