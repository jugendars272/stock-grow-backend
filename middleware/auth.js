const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) res.send("Please login first");
    const token = req.header("Authorization")?.split(' ')[1];
    const {phone , _id , iat} = jwt.verify(token, JWT_SECRET);
    req.userId = _id
    next();
  } catch (ex) {
    res.status(401).send(ex.message);
  }
};
