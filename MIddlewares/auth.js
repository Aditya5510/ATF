const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

// console.log(process.env.SECRET_KEY);

// const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["token"];

    if (!token) {
      throw new Error("No token provided");
    }

    const { normalizedEmail } = jwt.verify(token, process.env.SECRET_KEY);

    req.body = {
      ...req.body,
      normalizedEmail,
    };

    return next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = verifyToken;
