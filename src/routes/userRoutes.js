import mongoose from "mongoose";
import express from "express";
import {
  requireAuth,
  requireAdminAuth,
  canUpdateUser,
  canUpdateRole,
} from "../middlewares/basicAuth.js";

const User = mongoose.model("User");
const router = express.Router();

router.get("/user", requireAuth, requireAdminAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

router.get("/user/:id", requireAuth, async (req, res) => {
  try {
    if (req.user._id == req.params.id) {
      return res.send({ user: req.user });
    }

    throw new Error("Not authorized to view this user");
  } catch (error) {
    return res.status(401).send(error.message);
  }
});

router.put(
  "/user/:id",
  requireAuth,
  canUpdateUser,
  canUpdateRole,
  async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
      await User.findByIdAndUpdate(id, updates);

      res.send({ success: "Update Successful" });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
);

export default router;
