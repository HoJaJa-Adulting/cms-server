import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ROLE } from "../resources/constants";

const User = mongoose.model("User");

export const requireAuth = async (req, res, next) => {
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

export const requireAdminAuth = (req, res, next) => {
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(403).send({ error: "Action not authorized" });
  }
  next();
};

export const canUpdateUser = (req, res, next) => {
  if (req.user._id != req.params.id && req.user.role !== ROLE.ADMIN) {
    return res.status(403).send({ error: "Action not authorized" });
  }
  next();
};

export const canUpdateRole = (req, res, next) => {
  const { user, body } = req;
  if (body.role && user.role !== ROLE.ADMIN) {
    return res
      .status(403)
      .send({ error: "Only an admin user can update role" });
  }
  next();
};
