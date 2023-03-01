const router = require("express").Router();
const userRoute = require("./user");
const urlCheck = require("./urlCheck");

router.use("/user", userRoute);
router.use("/urlCheck", urlCheck);

module.exports = router;
