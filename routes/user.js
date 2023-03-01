const router = require("express").Router();
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");

const userServices = require("../services/userServices");
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

router.put(
  "/signup",
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
    res.json(await userServices.signUp(userData));
  })
);

router.put(
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

    let token = await userServices.logIn(userData);

    return res.status(200).json(token);
  })
);
//delete user
//whenever you get to it remember to loop over the urlCheck list
// and delete all the urlCheck by id

module.exports = router;
