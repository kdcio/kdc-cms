const readline = require("readline-sync");
const validateEmail = require("./validateEmail");
const Users = require("../models/users");

Users.list()
  .then(list => {
    if (list && list.Items && list.Items.length > 0) {
      return Promise.reject("DB already has user(s).");
    }
  })
  .then(() => {
    let name = null;
    let email = null;
    let password = null;

    while (1) {
      name = readline.question("Your name: ");
      if (name.length > 0) break;
      console.log("Name cannot be empty.");
    }

    while (1) {
      email = readline.question("Your email address: ");
      if (validateEmail(email)) {
        break;
      }
      console.log("Invalid email.");
    }

    while (1) {
      password = readline.question("Your password: ", { hideEchoBack: true });
      if (password.length <= 0) {
        console.log("Password cannot be empty.");
      }

      const confirm = readline.question("Confirm password: ", {
        hideEchoBack: true
      });
      if (confirm.length <= 0) {
        console.log("Confirm password cannot be empty.");
      }

      if (password === confirm) {
        break;
      }

      console.log("Password does not match");
    }

    return Users.create({ email, password, name })
      .then(() => {
        console.log("User created");
      })
      .catch(e => console.log(e));
  })
  .catch(e => console.log(e));
