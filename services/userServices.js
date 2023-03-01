require("dotenv").config();
const salt = process.env.JWT_SECRETORKEY;
const User = require("../models/user.model");
const createError = require("http-errors");
const util = require("../utilities/utilities");
const jwt = require("jsonwebtoken");

module.exports = {
  async signUp(body) {
    try {
      body.password = util.genPassword(body.password); // hash the password
      const user = await User.create(body);
      return user;
    } catch (error) {
      throw createError(400, error.message);
    }
  },

  async logIn(userData) {
    try {
      user = await User.findOne({ email: userData.email });
      if (!user) throw createError(400, "User not found!");
      if (util.validPassword(userData.password, user.password)) {
        return await this.GenerateToken(user);
      } else {
        if (user) throw createError(400, "Password is incorrect!");
      }
    } catch (error) {
      throw createError(400, error.message);
    }
  },
  async addUrlCheck(userID, urlCheckId) {
    try {
      user = await User.findByIdAndUpdate(userID, {
        $addToSet: { urlCheck: urlCheckId },
      });
      if (!user) throw createError(400, "User not found!");
    } catch (error) {
      throw createError(400, error.message);
    }
  },
  async deleteUrlCheck(userID, urlCheckID) {
    try {
      let user = await User.findByIdAndUpdate(
        userID,
        { $pull: { urlCheck: { $in: [urlCheckID] } } },
        { new: true }
      );

      if (!user) throw createError(400, "User not found!");
      return user;
    } catch (error) {
      throw createError(400, error.message);
    }
  },

  async GenerateToken(userData) {
    var payload = { id: userData._id };
    return jwt.sign(payload, salt, { expiresIn: "6h" });
  },
};
