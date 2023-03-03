const reportModel = require("../models/report.model");
const createError = require("http-errors");

module.exports = {
  //create a report for a urlCheck to hold the url-monitoring data (status, uptime, etc)
  async createReport(reportData) {
    try {
      return await reportModel.create(reportData);
    } catch (error) {
      throw createError(400, error.message);
    }
  },

  //delete urlCheck from data base and remove its reference from the user database
  async deleteReport(reportID) {
    try {
      //get the report by urlCheckID and delete it
      await reportModel.findByIdAndDelete(reportID);
    } catch (error) {
      throw createError(400, error.message);
    }
  },

  //get the report using the report id
  async getReport(reportID) {
    try {
      const report = await reportModel.findById(reportID);
      return report;
    } catch (error) {
      throw createError(400, error.message);
    }
  },

  //update the report based on the old data and the new log
  async updateReport(reportID, log, status, interval, time) {
    try {
      oldReport = await reportModel.findOne(reportID);

      var newReport = this.calculateNewReport(
        oldReport,
        log,
        status,
        interval,
        time
      );

      return await reportModel.findByIdAndUpdate(reportID, newReport);
    } catch (error) {
      return error;
    }
  },

  // helper function to calculate the new report
  calculateNewReport(report, log, status, interval, time) {
    //updating status
    report.status = status;
    //updating availability
    if (status == "active") {
      report.uptime += interval;
    }
    if (status == "not active") {
      //updating outages
      report.outages += 1;
      //downtime
      report.downtime += interval;
    }
    //updating reponse time
    if (report.responseTime == 0) {
      report.responseTime = time[0] * 1000 + time[1] / 1000000; // time in milliseconds
    }
    //updating availability
    report.availability =
      (report.uptime / (report.uptime + report.downtime)) * 100;
    //updating History
    log.time = Date.now();
    report.History.push(log);

    return report;
  },
};
