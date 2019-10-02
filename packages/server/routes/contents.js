const express = require('express');
const HttpStatus = require('http-status-codes');
const Contents = require('../models/contents');

const router = express.Router();

router.get('/:type', async (req, res) => {
  const { type } = req.params;
  const list = await Contents.list(type);
  res.status(HttpStatus.OK);
  res.send(list.Items);
});

router.post('/:type', async (req, res) => {
  const { type } = req.params;
  const { body } = req;
  const slug = await Contents.post({ type, ...body });
  res.status(HttpStatus.CREATED);
  res.send({ slug });
});

router.put('/:type/:slug', async (req, res) => {
  const { type, slug } = req.params;
  const { body } = req;
  await Contents.put({ type, slug, attr: body });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.delete('/:type/:slug', async (req, res) => {
  const { type, slug } = req.params;
  await Contents.delete({ type, slug });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.get('/:type/:slug', async (req, res) => {
  const { type, slug } = req.params;
  const item = await Contents.get({ type, slug });
  res.status(HttpStatus.OK);
  res.send(item);
});

module.exports = router;
