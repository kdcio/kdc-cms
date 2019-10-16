import express from 'express';
import HttpStatus from 'http-status-codes';
import Contents from 'kdc-cms-models/models/contents';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const list = await new Contents().list(id);
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
    const Slug = await new Contents().post({ id, ...body });
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
    await new Contents().put({ id, slug, attr: body });
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
    await new Contents().delete({ id, slug });
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
    const item = await new Contents().get({ id, slug });
    res.status(HttpStatus.OK);
    res.send(item);
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND);
    res.send(error);
  }
});

export default router;
