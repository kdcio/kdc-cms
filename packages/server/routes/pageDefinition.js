const express = require('express');
const HttpStatus = require('http-status-codes');
const PageDefinition = require('../models/pageDefinition');

const router = express.Router();

router.get('/', async (req, res) => {
  const list = await PageDefinition.list();
  res.status(HttpStatus.OK);
  res.send(list);
});

router.post('/', async (req, res) => {
  const { body } = req;
  const id = await PageDefinition.post(body);
  res.status(HttpStatus.CREATED);
  res.send({ id });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  await PageDefinition.put({ id, attr: body });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await PageDefinition.delete({ id });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const item = await PageDefinition.get({ id });
  res.status(HttpStatus.OK);
  res.send(item);
});

module.exports = router;
