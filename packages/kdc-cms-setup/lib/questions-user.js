const inquirer = require("inquirer");
const validator = require("validator");
const chalk = require("chalk");
const { validatePassword } = require("kdc-cms-utils");

const requireLetterAndNumber = value => {
  if (!value) {
    return "Password cannot be blank";
  }

  if (value.length < 6) {
    return "Password needs to be at least 6 characters";
  }

  if (!validatePassword(value)) {
    return "Password need to have at least a letter and a number";
  }

  return true;
};

const requireValidEmail = value => {
  if (validator.isEmail(value)) {
    return true;
  }

  return "Please enter valid email";
};

const requireValidUsername = value => {
  if (!value) {
    return "Username cannot be blank";
  }

  if (value.length < 3) {
    return "Username needs to be at least 3 characters";
  }

  if (!validator.isAlphanumeric(value)) {
    return "Username needs to be alphanumeric characters";
  }

  return true;
};

const role = "dev";
const start = async ctx => {
  console.log(`\n\n${chalk.green.bold("First admin user:")}\n`);

  let user = { role };
  let ans = await inquirer.prompt([
    {
      type: "input",
      message: "Enter your name:",
      name: "name"
    },
    {
      type: "input",
      message: "Enter your username:",
      name: "username",
      validate: requireValidUsername
    },
    {
      type: "input",
      message: "Enter your email:",
      name: "email",
      validate: requireValidEmail
    }
  ]);

  user = { ...user, ...ans };

  while (!user.password) {
    ans = await inquirer.prompt([
      {
        type: "password",
        message: "Enter your password:",
        name: "password1",
        mask: "*",
        validate: requireLetterAndNumber
      },
      {
        type: "password",
        message: "Confirm password:",
        name: "password2",
        mask: "*",
        validate: requireLetterAndNumber
      }
    ]);

    if (ans.password1 !== ans.password2) {
      console.log("Passwords did not match");
    } else {
      user.password = ans.password1;
    }
  }

  return { ...ctx, user };
};

module.exports = start;
