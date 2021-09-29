require("dotenv").config();
require("./models/User");
require("./models/Page");
require("./models/Suggestion");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();
const port = process.env.PORT || 3001;

const USER = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;

// Database stuff
const mongoUri = `mongodb+srv://${USER}:${PASSWORD}@dev-cms-db.ovamu.mongodb.net/dev-db?retryWrites=true&w=majority`; // Add connection string here, between the quotes
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});
mongoose.set("useFindAndModify", false);
mongoose.set("runValidators", true);

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
};

// Server stuff
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(allowCrossDomain);
app.use(authRoutes);
app.use(pageRoutes);
app.use(suggestionRoutes);

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
