const express = require("express");
const HttpStatus = require("http-status-codes");
const ContentDefinition = require("../models/contentDefinition");

const router = express.Router();

router.get("/", async (req, res) => {
  const list = await ContentDefinition.list();
  res.status(HttpStatus.OK);
  res.send(list.Items);
});

router.post("/", async (req, res) => {
  const { body } = req;
  const type = await ContentDefinition.post(body);
  res.status(HttpStatus.CREATED);
  res.send({ type });
});

router.put("/:type", async (req, res) => {
  const { type } = req.params;
  const { body } = req;
  await ContentDefinition.put({ type, attr: body });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.delete("/:type", async (req, res) => {
  const { type } = req.params;
  await ContentDefinition.delete({ type });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.get("/:type", async (req, res) => {
  const { type } = req.params;
  const item = await ContentDefinition.get({ type });
  res.status(HttpStatus.OK);
  res.send(item);
});

module.exports = router;
