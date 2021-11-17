import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLE } from "../resources/constants";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: Object.values(ROLE),
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("suggestions", {
  ref: "Suggestion",
  localField: "_id",
  foreignField: "creator",
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY"); // Change secret key
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.comparePassword = function (possiblePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(possiblePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

export default mongoose.model("User", userSchema);
