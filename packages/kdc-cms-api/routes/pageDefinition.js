const express = require('express');
const HttpStatus = require('http-status-codes');
const PageDefinition = require('../models/pageDefinition');
const Pages = require('../models/pages');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await PageDefinition.list();
    res.status(HttpStatus.OK);
    res.send(list);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.post('/', async (req, res) => {
  const { body } = req;
  try {
    const { id, name, fields } = body;
    await PageDefinition.post(body);
    await Pages.post({ id, name, fields });

    res.status(HttpStatus.CREATED);
    res.send({ id });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const { name, fields } = body;
    await PageDefinition.put({ id, attr: body });
    await Pages.put({ id, name, fields });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await PageDefinition.delete({ id });
    await Pages.delete({ id });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await PageDefinition.get({ id });
    res.status(HttpStatus.OK);
    res.send(item);
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND);
    res.send(error);
  }
});

module.exports = router;
