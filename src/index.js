import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import "./models/Page.js";
import "./models/Suggestion.js";
import "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

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

const allowedOrigins = [
  "http://localhost:3002/",
  "https://hojaja-cms-client.herokuapp.com/",
];
const allowCrossDomain = function (req, res, next) {
  const origin = req.headers.referer;
  console.log("req.headers", req.headers);
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
  }
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
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
app.use(userRoutes);

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
