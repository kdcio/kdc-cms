import express from 'express';
import HttpStatus from 'http-status-codes';
import PageDefinition from 'kdc-cms-models/models/pageDefinition';
import Pages from 'kdc-cms-models/models/pages';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await new PageDefinition().list();
    res.status(HttpStatus.OK);
    res.send(list);
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.post('/', async (req, res) => {
  const { body } = req;
  try {
    const { id, name, fields } = body;
    await new PageDefinition().post(body);
    await new Pages().post({ id, name, fields });

    res.status(HttpStatus.CREATED);
    res.send({ id });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const { name, fields } = body;
    await new PageDefinition().put({ id, attr: body });
    await new Pages().put({ id, name, fields });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await new PageDefinition().delete({ id });
    await new Pages().delete({ id });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await new PageDefinition().get({ id });
    res.status(HttpStatus.OK);
    res.send(item);
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.NOT_FOUND);
    res.send(error);
  }
});

export default router;
