import mongoose from "mongoose";
import express from "express";
import { requireAuth, requireAdminAuth } from "../middlewares/basicAuth.js";

const Page = mongoose.model("Page");
const router = express.Router();

router.get("/page", async (req, res) => {
  try {
    const pages = await Page.find({});
    res.send(pages);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

router.post("/page", requireAuth, requireAdminAuth, async (req, res) => {
  const { name, content } = req.body;

  try {
    const page = new Page({ name, content });
    await page.save();

    res.send(page);
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.get("/page/:name/edit", requireAuth, async (req, res) => {
  const { name } = req.params;
  try {
    const page = await Page.findOne({ name });

    res.send(page);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

router.get("/page/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const page = await Page.findOne({ name });

    res.send(page);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

router.put("/page/:name", requireAuth, requireAdminAuth, async (req, res) => {
  const { name } = req.params;
  const updates = req.body;

  try {
    await Page.updateOne({ name }, updates);

    res.send({ success: "Update Successful" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

export default router;
