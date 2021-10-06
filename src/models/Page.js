import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  content: [{}],
});

export default mongoose.model("Page", pageSchema);
