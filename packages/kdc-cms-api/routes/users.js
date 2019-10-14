const express = require('express');
const HttpStatus = require('http-status-codes');
const Users = require('kdc-cms-models/models/users');

const router = express.Router();

// this should be protected
router.get('/', async (req, res) => {
  const list = await Users.list();
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
  const email = await Users.create(body);
  res.status(HttpStatus.CREATED);
  res.send({ email });
});

router.post('/authenticate', async (req, res, next) => {
  Users.authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: 'Username and/or password is incorrect' })
    )
    .catch(err => next(err));
});

router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { body } = req;
  await Users.put({ email, attr: body });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.delete('/:email', async (req, res) => {
  const { email } = req.params;
  await Users.delete({ email });
  res.status(HttpStatus.NO_CONTENT);
  res.send();
});

router.get('/:email', async (req, res) => {
  const { email } = req.params;
  const item = await Users.get({ email });
  res.status(HttpStatus.OK);
  res.send(item);
});

router.put('/:email/changePassword', async (req, res) => {
  const { email } = req.params;
  const { body } = req;

  try {
    await Users.changePassword({ email, ...body });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED);
    res.send();
  }
});

module.exports = router;