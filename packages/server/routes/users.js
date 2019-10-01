const express = require("express");
const HttpStatus = require("http-status-codes");
const Users = require("../models/users");

const router = express.Router();

// this should be protected
router.get("/", async (req, res) => {
  const list = await Users.list();
  res.status(HttpStatus.OK);
  res.send(list);
});

router.post("/authenticate", async (req, res, next) => {
  Users.authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch(err => next(err));
});

module.exports = router;
