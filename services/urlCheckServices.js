const urlCheckModel = require("../models/urlCheck.model");
const createError = require("http-errors");
const userServices = require("./userServices");
const reportServices = require("./reportServices");

const urlmon = require("url-monitor");
const User = require("../models/user.model");
module.exports = {
  async addTag(tagName, urlChecks) {
    urlChecks.map(async (urlcheckID) => {
      try {
        await urlCheckModel.findByIdAndUpdate(urlcheckID, {
          $addToSet: { tag: tagName },
        });
      } catch (error) {}
    });
  },
  async createUrlCheck(userID, urlCheckData) {
    try {
      //
      reportData = {
        status: "active",
        availability: 100,
        outages: 0,
        downtime: 0,
        uptime: 0,
        responseTime: 0,
        History: [],
      };
      //create a report to collect data int it
      let report = await reportServices.createReport(reportData);

      urlCheckData.report = report._id;

      const urlCheck = await urlCheckModel.create(urlCheckData);
      await userServices.addUrlCheck(userID, urlCheck._id); //  add the urlcheck's id to the list of user urlchecks
      return urlCheck;
    } catch (error) {
      throw createError(400, error.message);
    }
  },
  //delete urlCheck from data base and remove its reference from the user database
  async deleteUrlCheck(userID, urlCheckID) {
    try {
      let urlCheck = await this.getUrlCheck(urlCheckID);
      //check if this user is authorized to delete (is the one that created it)
      if (urlCheck.user.equals(userID)) {
        //delete the urlCheck
        await urlCheckModel.findByIdAndDelete(urlCheckID);
        //delete the report (data holder)
        await reportServices.deleteReport(urlCheck.report);
        //delete the urlCheck reference from the user
        await userServices.deleteUrlCheck(userID, urlCheckID);
      } else {
        throw createError(400, "Delete not authorized!!");
      }
    } catch (error) {
      throw createError(400, error.message);
    }
  },
  async getUrlCheck(urlCheckID) {
    try {
      const urlCheck = await urlCheckModel.findById(urlCheckID);
      return urlCheck;
    } catch (error) {
      throw createError(400, error.message);
    }
  },

  async getReport(urlCheckID) {
    try {
      const urlCheck = await urlCheckModel.findById(urlCheckID);
      const report = await reportServices.getReport(urlCheck.report);
      return report;
    } catch (error) {
      throw createError(400, error.message);
    }
  },
  async getReporByTag(user, tag) {
    try {
      var urlChecks = await userServices.getUrlCheck(user);
      var reports = [];

      for (i = 0; i < urlChecks.length; i++) {
        let urlCheck = await this.getUrlCheck(urlChecks[i]);
        if (urlCheck.tag.includes(tag)) {
          let report = await reportServices.getReport(urlCheck.report);
          reports.push(report);
        }
        console.log(reports);
      }

      return reports;
    } catch (error) {
      throw createError(400, error.message);
    }
  },
  async monitorUrl(urlCheck) {
    var url = "";

    //handle the cases were a user adds a url that contains "http://"" or does not contain it and adding port to url
    if (urlCheck.url.includes("http")) {
      url = urlCheck.url;
      if (urlCheck.port) {
        url += ":" + port;
      }
    } else {
      url = urlCheck.protocol + "://" + urlCheck.url;
      if (urlCheck.port) {
        url += ":" + urlCheck.port;
      }
    }
    var website = new urlmon({
      url: url,
      interval: urlCheck.interval,
      timeout: urlCheck.timeout,
    });
    const startTime = process.hrtime();
    console.log(website.url);
    website.on("error", (data) => {
      website.stop();
    });
    website.on("available", async (data) => {
      var report = await reportServices.updateReport(
        urlCheck.report,
        data,
        "active",
        website.interval,
        process.hrtime(startTime)
      );
      // if the report is deleted then stop monitoring
      if (Object.prototype.toString.call(report) === "[object Error]") {
        website.stop();
      }
    });
    website.on("unavailable", async (data) => {
      console.log(data);
      var report = awaitreportServices.updateReport(
        urlCheck.report,
        data,
        "not active",
        website.interval,
        process.hrtime(startTime)
      );
      // if the report is deleted then stop monitoring
      if (Object.prototype.toString.call(report) === "[object Error]") {
        website.stop();
      }
    });

    website.start();
  },
};
