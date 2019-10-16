import express from 'express';
import HttpStatus from 'http-status-codes';
import Users from 'kdc-cms-models/models/users';

const router = express.Router();

// this should be protected
router.get('/', async (req, res) => {
  const user = new Users();
  const list = await user.list();
  res.status(HttpStatus.OK);
  res.send(list.Items);
});

/**
 * Issue: what happens if user is deleted or change roles?
 * I explicitly didn't check the db to reduce cost.
 * Possible solutions:
 * 1. Implement refresh token
 * 2. express-jwt-permissions?
 * 3. https://auth0.com/blog/blacklist-json-web-token-api-keys/
 */
router.get('/me', async (req, res) => {
  const { user } = req;
  res.status(HttpStatus.OK);
  res.send({ user });
});

router.post('/', async (req, res) => {
  const { body } = req;
  const user = new Users();
  const email = await user.create(body);
  res.status(HttpStatus.CREATED);
  res.send({ email });
});

router.post('/authenticate', async (req, res, next) => {
  const user = new Users();
  user
    .authenticate(req.body)
    .then(u =>
      u
        ? res.json(u)
        : res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: 'Username and/or password is incorrect' })
    )
    .catch(err => next(err));
});

router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { body } = req;
  const user = new Users();
  await user.put({ email, attr: body });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.delete('/:email', async (req, res) => {
  const { email } = req.params;
  const user = new Users();
  await user.delete({ email });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.get('/:email', async (req, res) => {
  const { email } = req.params;
  const user = new Users();
  const item = await user.get({ email });
  res.status(HttpStatus.OK);
  res.send(item);
});

router.put('/:email/changePassword', async (req, res) => {
  const { email } = req.params;
  const { body } = req;
  const user = new Users();

  try {
    await user.changePassword({ email, ...body });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED);
    res.send();
  }
});

export default router;
