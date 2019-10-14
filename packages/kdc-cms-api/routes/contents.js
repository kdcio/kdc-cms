const express = require('express');
const HttpStatus = require('http-status-codes');
const Contents = require('kdc-cms-models/models/contents');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const list = await Contents.list(id);
    res.status(HttpStatus.OK);
    res.send(list);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const Slug = await Contents.post({ id, ...body });
    res.status(HttpStatus.CREATED);
    res.send({ Slug });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.put('/:id/:slug', async (req, res) => {
  try {
    const { id, slug } = req.params;
    const { body } = req;
    await Contents.put({ id, slug, attr: body });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    console.log(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.delete('/:id/:slug', async (req, res) => {
  try {
    const { id, slug } = req.params;
    await Contents.delete({ id, slug });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.get('/:id/:slug', async (req, res) => {
  try {
    const { id, slug } = req.params;
    const item = await Contents.get({ id, slug });
    res.status(HttpStatus.OK);
    res.send(item);
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND);
    res.send(error);
  }
});

module.exports = router;
