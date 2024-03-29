const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenkey = process.env.TOKEN_KEY;

const verifyToken = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Invalid Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    let decodedToken = jwt.verify(token, `${tokenkey}`);
    if (!decodedToken) {
      res.status(401).json({ message: "Not Authorized" });
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
   next(error)
  }
};
const verifyResetToken = async (req, res, next) => {
  const authHeader = req.get("Reset-Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Invalid Authorization header");
  }
  const token = authHeader.split(" ")[1];
  try {
    let decodedToken = jwt.verify(token, `${tokenkey}`);
    if (!decodedToken) {
      throw new Error("Not Authorized");
    }
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    next(error);
  }
};
const verifySchAdmin = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (decoded.AdminRole !== "SchoolAdmin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this operation",
      });
    }
    req.AdminRole = decoded.AdminRole;
    next();
  } catch (error) {
    next(error)
  }
};
const verifyUniAdmin = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    // console.log(decoded);
    if (decoded.AdminRole !== "UniversityAdmin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this operation",
      });
    }
    req.AdminRole = decoded.AdminRole;
    next();
  } catch (error) {
   
   next(error)
    // console.log(error);
  }
};
module.exports = {
  verifyToken,
  verifyResetToken,
  verifySchAdmin,
  verifyUniAdmin,
};
