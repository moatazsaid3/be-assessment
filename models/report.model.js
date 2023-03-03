const { timeStamp, time } = require("console");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    // - `status`: The current status of the URL.
    status: {
      type: String,
      required: true,
      trim: true,
      default: "active",
    },
    // - `availability`: A percentage of the URL availability.
    availability: {
      type: Number,
      required: true,
      trim: true,
      default: 100,
    },
    // - `outages`: The total number of URL downtimes.
    outages: {
      type: Number,
      trim: true,
      default: 0,
    },
    // - `downtime`: The total time, in seconds, of the URL downtime.
    downtime: {
      type: Number,
      trim: true,
      default: 0,
    },
    // - `uptime`: The total time, in seconds, of the URL uptime.
    uptime: {
      type: Number,
      trim: true,
      default: 0,
    },
    // - `responseTime`: The average response time for the URL.

    responseTime: {
      type: Number,
      trim: true,
      default: 0,
    },
    // - `history`: Timestamped logs of the polling requests.
    History: [
      {
        type: new mongoose.Schema(
          {
            _id: false,
            code: {
              type: Number,
            },
            url: {
              type: String,
              trim: true,
            },
            message: {
              type: String,
              trim: true,
            },
          },
          { timestamps: true }
        ),
      },
    ],
  },

  {
    timestamps: true,
  }
);
const report = mongoose.model("report", reportSchema);

module.exports = report;
