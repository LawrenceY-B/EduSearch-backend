const express = require("express");
const {
  AddNewUser,
  login,
  logout,
  verifyNumber,
  forgotPassword,
  resendOTP,
  resetPassword
} = require("../controllers/Auth");
const router = express.Router();

router.post("/signup", AddNewUser);
router.post("/login", login);
router.post("/verifynumber", verifyNumber);
router.post('/resendotp', resendOTP)
router.delete("/logout", logout);
router.post("/forgotpass", forgotPassword);
router.post("/resetpass", resetPassword);
// router.params()


module.exports = router;
