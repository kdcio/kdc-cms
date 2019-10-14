const express = require('express');
const HttpStatus = require('http-status-codes');
const Pages = require('kdc-cms-models/models/pages');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await Pages.list();
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
    const id = await Pages.post(body);
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
    await Pages.put({ id, attr: body });
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
    const item = await Pages.get({ id });
    res.status(HttpStatus.OK);
    res.send(item);
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND);
    res.send(error);
  }
});

module.exports = router;
