const mongoose = require("mongoose");
const bcypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcypt.hash(user.password, salt, (err, hash) => {
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
    bcypt.compare(possiblePassword, user.password, (err, isMatch) => {
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

mongoose.model("User", userSchema);
