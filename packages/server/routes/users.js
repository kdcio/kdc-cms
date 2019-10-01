const express = require("express");
const HttpStatus = require("http-status-codes");
const Users = require("../models/users");

const router = express.Router();

// this should be protected
router.get("/", async (req, res) => {
  const list = await Users.list();
  res.status(HttpStatus.OK);
  res.send(list.Items);
});

router.post("/create", async (req, res) => {
  const { body } = req;
  const email = await Users.create(body);
  res.status(HttpStatus.OK);
  res.send({ email });
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

router.put("/:email", async (req, res) => {
  const { email } = req.params;
  const { body } = req;
  await Users.put({ email, attr: body });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.delete("/:email", async (req, res) => {
  const { email } = req.params;
  await Users.delete({ email });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;
  const item = await Users.get({ email });
  res.status(HttpStatus.OK);
  res.send(item);
});

module.exports = router;
