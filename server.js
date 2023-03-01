const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const api = require("./routes/api");
//passport and jwt tokken
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

require("dotenv").config();
const User = require("./models/user.model");

const app = express();
const port = process.env.PORT || 5000;

//app.use(cors());
app.use(express.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

// app.use(passport.initialize());
// app.use(passport.session());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongoDB database connection established succesfully");
});

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRETORKEY;

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.id })
      .then((user) => {
        console.log(user);
        return done(null, user);
      })
      .catch((err) => {
        return done(err, false);
      });

    // User.findOne({ _id: jwt_payload.id }, (err, user) => {
    //   if (err) {
    //     return done(err, false);
    //   }
    //   if (user) {
    //     return done(null, user);
    //   } else {
    //     return done(null, false);
    //   }
    // }).select("-password");
  })
);

app.use("/api", api);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
