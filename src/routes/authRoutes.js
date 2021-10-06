import mongoose from "mongoose";
import express from "express";
import { requireAuth } from "../middlewares/basicAuth.js";

const User = mongoose.model("User");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const user = new User({ email, password, name, role });
    await user.save();

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

router.post("/signout", requireAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

export default router;
