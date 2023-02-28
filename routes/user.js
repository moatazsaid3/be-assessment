const router = require("express").Router();
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");

//const userServices = require("../services/userServices");
const passport = require("passport");

router.get(
  "/allusers",
  [],
  asyncHandler(async (req, res) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (error) {
      res.status(400).json("Error: " + error);
    }
  })
);

router.post(
  "/createUser",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  asyncHandler(async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let body = req.body;
    let userData = {
      email: body.email,
      password: body.password,
      username: body.email.split("@")[0],
    };
    res.json(await userServices.SignUp(userData));
  })
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").isString()],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let body = req.body;
    let userData = {
      email: body.email,
      password: body.password,
    };

    let token = await userServices.LogIn(userData);
    res.cookie("access-token", token, {
      maxAge: 60 * 60 * 24 * 30 * 1000, //30 days
      secure: false,
      httpOnly: true,
    });
    return res.status(200).json(token);
  })
);

router.post(
  "/Token",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    return res.status(200).json(req.user);
  })
);

module.exports = router;
