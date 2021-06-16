const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  content: [{}],
});

mongoose.model("Page", pageSchema);
