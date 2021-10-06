import mongoose from "mongoose";
import express from "express";
import { requireAuth } from "../middlewares/basicAuth.js";

const Suggestion = mongoose.model("Suggestion");
const router = express.Router();

router.get("/suggestion", requireAuth, async (req, res) => {
  try {
    const suggestions = await Suggestion.find({});

    res.send(suggestions);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

router.get("/suggestion/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const suggestion = await Suggestion.findById(id);
    await suggestion.populate("creator").execPopulate();

    res.send(suggestion);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

router.post("/suggestion", requireAuth, async (req, res) => {
  const { page, suggestions } = req.body;

  try {
    const newSuggestion = new Suggestion({
      page,
      suggestions,
      creator: req.user._id,
    });
    await newSuggestion.save();

    res.send(newSuggestion);
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.put("/suggestion/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  let { page, suggestions, status } = req.body;
  if (suggestions) status = "waiting";
  const updates = Object.assign(
    {},
    ...Object.entries({ page, suggestions, status })
      .filter(([_, value]) => value)
      .map(([key, value]) => ({ [key]: value }))
  );

  try {
    await Suggestion.findByIdAndUpdate(id, updates);

    res.send({ success: "Update Successful" });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

export default router;
