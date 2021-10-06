import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  page: { type: mongoose.Schema.Types.ObjectId, ref: "Page", required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  suggestions: [{}],
  status: {
    type: String,
    required: true,
    enum: ["waiting", "approved", "declined"],
    default: "waiting",
  },
});

export default mongoose.model("Suggestion", suggestionSchema);
