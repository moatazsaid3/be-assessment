const urlCheckModel = require("../models/urlCheck.model");
const createError = require("http-errors");
const userServices = require("./userServices");
const { $where } = require("../models/urlCheck.model");
module.exports = {
  async createUrlCheck(userID, urlCheckData) {
    try {
      const urlCheck = await urlCheckModel.create(urlCheckData);
      await userServices.addUrlCheck(userID, urlCheck._id);
      return urlCheck;
    } catch (error) {
      throw createError(400, error.message);
    }
  },
  //delete urlCheck from data base and remove its reference from the user database
  async deleteUrlCheck(userID, urlCheckID) {
    try {
      let urlCheck = await this.getUrlCheck(urlCheckID);

      if (urlCheck.user.equals(userID)) {
        //delete the urlCheck
        await urlCheckModel.findByIdAndDelete(urlCheckID);
        //delete the urlCheck reference from the user
        return await userServices.deleteUrlCheck(userID, urlCheckID);
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
};
