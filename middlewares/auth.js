const jwt = require("jsonwebtoken");
const config = require("../config/secret");

exports.auth = async (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, config.tokenSecret);
    req.token = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
};

exports.authAdmin = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ msg: "You need to send token to this endpoint" });
  }
  try {
    let decodeToken = jwt.verify(token, config.tokenSecret);
    if (decodeToken.role !== "admin") {
      return res.status(401).json({ msg: "Token invalid or not admin, code: 6A" });
    }
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid or expired, code: 6B" });
  }
};
