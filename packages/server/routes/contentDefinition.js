const express = require('express');
const HttpStatus = require('http-status-codes');
const ContentDefinition = require('../models/contentDefinition');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await ContentDefinition.list();
    res.status(HttpStatus.OK);
    res.send(list);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const { body } = req;
    const id = await ContentDefinition.post(body);
    res.status(HttpStatus.CREATED);
    res.send({ id });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    await ContentDefinition.put({ id, attr: body });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ContentDefinition.delete({ id });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ContentDefinition.get({ id });
    res.status(HttpStatus.OK);
    res.send(item);
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND);
    res.send(error);
  }
});

module.exports = router;
