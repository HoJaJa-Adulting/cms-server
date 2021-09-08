require("./models/User");
require("./models/Page");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();
const port = 3001;

// Database stuff
const mongoUri = ""; // Add connection string here, between the quotes
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

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
