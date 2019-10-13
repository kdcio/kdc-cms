const inquirer = require("inquirer");
const { validateEmail, validatePassword } = require("kdc-cms-utils");
const {
  regions: awsRegions,
  regionNames: awsRegionNames
} = require("./aws-regions");
const awsProfiles = require("./aws-profiles");
const indexOf = require("lodash.indexof");

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

let name = null;
let email = null;
let password = null;
const role = "admin";
let region = null;
let profile = null;

const askPassword = async () => {
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

const askQuestions = async () => {
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

  await askPassword();

  ans = await inquirer.prompt({
    type: "list",
    name: "region",
    message: "AWS Region:",
    choices: awsRegionNames,
    filter: val => {
      const k = indexOf(awsRegionNames, val);
      return awsRegions[k];
    },
    when: () => !region
  });

  if (ans.region) region = ans.region;

  ans = await inquirer.prompt({
    type: "list",
    name: "profile",
    message: "AWS Profiles:",
    choices: awsProfiles,
    when: () => !profile
  });

  if (ans.profile) profile = ans.profile;
};

const start = async () => {
  while (!name || !email || !password || !region || !profile) {
    await askQuestions();
  }

  console.log(name, email, password, region, profile);
};

start();
