const router = require("express").Router();
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");

const urlCheckServices = require("../services/urlCheckServices");

//const userServices = require("../services/userServices");
const passport = require("passport");

// viewing urlCheck data using its id
router.get(
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
//takes urlCheckID
router.get(
  "/getReport",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    res.json(await urlCheckServices.getReport(req.body.urlCheckID));
  })
);

//takes: name(string), url(string), protocol(string), port(string), webhook(string), timeout(number), interval(Number),threshold(Number)
//need to be authenticated by a token
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
    let urlCheck = await urlCheckServices.createUrlCheck(
      req.user._id,
      urlCheckData
    );
    urlCheckServices.monitorUrl(urlCheck);
    res.json(urlCheck);
  })
);

// takes urlCheckID
// deletes the urlcheck, its refernce (_id) from the user's list of checks and the report the holds its monitoring data
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

//takes a name and a list of urlCheckIDs and adds the name to each urlCheck
router.put(
  "/groupByTag",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    console.log(req.body);
    res.json(await urlCheckServices.addTag(req.body.Name, req.body.urlChecks));
  })
);

//takes a name and a list of urlCheckIDs and adds the name to each urlCheck
router.get(
  "/getReportsByTag",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    var reports = await urlCheckServices.getReporByTag(
      req.user._id,
      req.body.Name
    );
    res.json(reports);
  })
);

module.exports = router;
