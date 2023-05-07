const express = require("express");
const {
  AddNewUser,
  login,
  logout,
  verifyNumber,
  forgotPassword,
  resendOTP,
  resetPassword,
  verifyreset
} = require("../controllers/Auth");
const {verifyToken, verifyResetToken}= require("../middleware/isAuth");
const router = express.Router();

router.post("/signup", AddNewUser);
router.post("/login", login);
router.post("/verifynumber", verifyNumber);
router.post('/resendotp', resendOTP)
router.get("/logout", verifyToken, logout);
router.post("/forgotpass", forgotPassword);
router.post("/verifyresetotp",verifyreset)
router.post("/resetpass", verifyResetToken,resetPassword);
// router.params()


module.exports = router;
