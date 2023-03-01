const router = require("express").Router();
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");

const urlCheckServices = require("../services/urlCheckServices");

//const userServices = require("../services/userServices");
const passport = require("passport");

// viewing urlCheck data using its id
router.post(
  "/getUrlCheck",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    res.json(await urlCheckServices.getUrlCheck(req.body.urlCheckID));
  })
);

//creating a Url check and adding its _id to the list of checks created by the user
router.put(
  "/createUrlCheck",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    urlCheckData = {
      Name: req.body.Name,
      url: req.body.url,
      protocol: req.body.protocol,
      port: req.body.port,
      webhook: req.body.webhook,
      timeout: req.body.timeout,
      interval: req.body.interval,
      threshold: req.body.threshold,
      user: req.user._id,
    };
    res.json(await urlCheckServices.createUrlCheck(req.user._id, urlCheckData));
  })
);

// deleting the urlcheck and deleting its refernce (_id) from the user's list of checks
router.delete(
  "/deleteUrlCheck",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    res.json(
      await urlCheckServices.deleteUrlCheck(req.user._id, req.body.urlCheckID)
    );
  })
);
module.exports = router;
