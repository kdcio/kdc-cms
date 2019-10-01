const expressJwt = require("express-jwt");

const jwt = () => {
  return expressJwt({ secret: process.env.JWT_SECRET }).unless({
    path: [
      // public routes that don't require authentication
      "/users/authenticate"
    ]
  });
};

module.exports = jwt;
