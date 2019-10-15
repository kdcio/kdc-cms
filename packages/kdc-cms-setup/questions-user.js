const inquirer = require("inquirer");
const { validateEmail, validatePassword } = require("kdc-cms-utils");

let name = null;
let email = null;
let password = null;
const role = "admin";

const requireLetterAndNumber = value => {
  if (validatePassword(value)) {
    return true;
  }

  return "Password need to have at least a letter and a number";
};

const requireValidEmail = value => {
  if (validateEmail(value)) {
    return true;
  }

  return "Please enter valid email";
};

const askUserQuestions = async () => {
  let ans = await inquirer.prompt({
    type: "input",
    message: "Enter your name:",
    name: "name",
    when: () => !name
  });
  if (ans.name) name = ans.name;

  ans = await inquirer.prompt({
    type: "input",
    message: "Enter your email:",
    name: "email",
    validate: requireValidEmail,
    when: () => !email
  });
  if (ans.email) email = ans.email;

  while (!password) {
    let ans = await inquirer.prompt([
      {
        type: "password",
        message: "Enter your password:",
        name: "password1",
        mask: "*",
        validate: requireLetterAndNumber,
        when: () => !password
      },
      {
        type: "password",
        message: "Confirm password:",
        name: "password2",
        mask: "*",
        validate: requireLetterAndNumber,
        when: () => !password
      }
    ]);
    if (ans.password1 !== ans.password2) {
      console.log("Passwords did not match");
    } else {
      password = ans.password1;
    }
  }
};

const start = async ctx => {
  while (!name || !email || !password) {
    await askUserQuestions();
  }

  return {
    ...ctx,
    user: { name, email, password, role }
  };
};

module.exports = start;
