"use strict";

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const usersRouter = require("./users/users-router");
const connectionsRouter = require("./user_connections/user_connections-router");
const userProfileRouter = require("./user_profile/user_profile_router");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const AuthHelpers = require("./authentication-helper");
const UsersService = require("./users/users-service");
const publicViewRouter = require('./public routes/public_routes_router');

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

// standard middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: "/",
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ msg: "Missing Information" });
  }
  const userAccount = await UsersService.getByEmail(app.get("db"), email).then(
    (data) => data
  );

  if (!userAccount) {
    res.status(403).json({ msg: "User doesnt exist" });
  } else {
    if (userAccount.password === password) {
    } else {
      res.status(403).json({ msg: "Password doesn't match" });
    }
  }
  let accessToken = AuthHelpers.createAccessToken({ email });
  let refreshToken = AuthHelpers.createRefreshToken({ email });

  req.session.user = { ...userAccount };
  req.session.user.refreshToken = refreshToken;
  res.cookie("authorization", accessToken, {
    secure: true,
    httpOnly: true,
  });
  res.json({ ...userAccount, accessToken });
});

app.post("/signup", function (req, res) {
  const { name, email, password, is_mentor, open_sessions } = req.body;
  const userAccount = UsersService.getByEmail(app.get("db"), email);
  if (userAccount) {
    res.status(400).json({ msg: "User already exists! Try login" });
  } else {
    UsersService.insertUser(app.get("db"), {
      name,
      email,
      password,
      is_mentor,
      open_sessions,
    }).then((data) => {
      let accessToken = AuthHelpers.createAccessToken({ email });
      let refreshToken = AuthHelpers.createRefreshToken({ email });

      req.session.user = data;
      req.session.user.refreshToken = refreshToken;
      res.cookie("Authorization", accessToken, {
        secure: true,
        httpOnly: true,
      });
      res.send();
    });
  }
});

app.post("/logout", function (req, res) {
  delete res.cookie;
  delete req.session;
  res.status(200);
});

// these are the public routes
app.use("/api/public", publicViewRouter);
// this is the authentication layer
app.use(AuthHelpers.verifyAuthTokens);
// below are private routes
// routes for all CRUD commands to the server
app.use("/api/users", usersRouter);
app.use("/api/connections", connectionsRouter);
app.use("/api/user_profiles", userProfileRouter);

// default route

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// error handlers
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = {
      error: {
        message: "server error, internal error please submit a bug report",
      },
    };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
