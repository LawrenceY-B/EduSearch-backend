const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenkey = process.env.TOKEN_KEY;

const verifyToken = async(req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("Invalid Authorization header");
  }
  const token = authHeader.split(" ")[1];
  try {
    let decodedToken = await jwt.verify(token, `${tokenkey}`);
    if (!decodedToken) {
        const error = new Error("Not Authorized");
        res.status(400).json(error);
      }
      req.userId = decodedToken.userId;
      next();
  } catch (error) {
    res.status(501).message("something went wrong");
    console.log(error);
  }
  
};
const isverified = (req, res, next) => {};
module.exports = {
  verifyToken,
  isverified,
};
