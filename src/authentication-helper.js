"use strict";
const jwt = require("jsonwebtoken");

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const verifyAuthTokens = (req, res, next) => {
  let accessToken =
    req.headers["authorization"] || req.cookies["authorization"];
  if (!accessToken) {
    res.status(403).json({ msg: "Access token is missing" });
  }

  let payload = null;
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (e) {
    res.status(403).send();
  }
};

module.exports = {
  verifyAuthTokens,
  createRefreshToken,
  createAccessToken,
};
