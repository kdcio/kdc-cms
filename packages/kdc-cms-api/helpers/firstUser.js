/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const readline = require('readline-sync');
const validateEmail = require('./validateEmail');
const Users = require('../models/users');

const TRUE = true;
Users.list()
  .then(list => {
    if (list && list.Items && list.Items.length > 0) {
      return Promise.reject(new Error('DB already has user(s).'));
    }
    return Promise.resolve();
  })
  .then(() => {
    let name = null;
    let email = null;
    let password = null;
    const role = 'admin';

    while (TRUE) {
      name = readline.question('Your name: ');
      if (name.length > 0) break;
      console.log('Name cannot be empty.');
    }

    while (TRUE) {
      email = readline.question('Your email address: ');
      if (validateEmail(email)) {
        break;
      }
      console.log('Invalid email.');
    }

    while (TRUE) {
      password = readline.question('Your password: ', { hideEchoBack: true });
      if (password.length <= 0) {
        console.log('Password cannot be empty.');
      }

      const confirm = readline.question('Confirm password: ', {
        hideEchoBack: true
      });
      if (confirm.length <= 0) {
        console.log('Confirm password cannot be empty.');
      }

      if (password === confirm) {
        break;
      }

      console.log('Password does not match');
    }

    return Users.create({ email, password, name, role })
      .then(() => {
        console.log('User created');
      })
      .catch(e => console.log(e));
  })
  .catch(e => console.log(e));
