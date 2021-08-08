const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error();
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, "MY_SECRET_KEY");

    const user = await User.findOne({
      _id: decoded.userId,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ error: "You must be logged in." });
  }
};
