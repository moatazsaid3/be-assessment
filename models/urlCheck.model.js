const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const urlCheckSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    protocol: {
      type: String,
      required: true,
      trim: true,
    },
    port: {
      type: String,
      trim: true,
    },
    webhook: {
      type: String,
      trim: true,
    },
    timeout: {
      type: Number,
      trim: true,
      default: 5000,
    },
    interval: {
      type: Number,
      trim: true,
      default: 600000,
    },
    threshold: {
      type: Number,
      trim: true,
    },
    user: {
      ref: "User",
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
const urlCheck = mongoose.model("urlCheck", urlCheckSchema);

module.exports = urlCheck;
