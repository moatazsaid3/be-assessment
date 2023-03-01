const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlenght: 3,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlenght: 3,
    },
    password: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    urlCheck: [
      {
        ref: "urlCheck",
        type: mongoose.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
