const inquirer = require("inquirer");
const crypto = require("crypto");
const { validateEmail, validatePassword } = require("kdc-cms-utils");
const {
  regions: awsRegions,
  regionNames: awsRegionNames
} = require("./aws-regions");
const awsProfiles = require("./aws-profiles");
const { stages, stageNames } = require("./stages");
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
let stage = null;
const jwt_secret = crypto.randomBytes(20).toString("hex");

const askAWSQuestions = async () => {
  let ans = await inquirer.prompt({
    type: "list",
    name: "stage",
    message: "Select stage:",
    choices: stageNames,
    default: "Local Development",
    filter: val => {
      const k = indexOf(stageNames, val);
      return stages[k];
    },
    when: () => !stage
  });

  if (ans.stage) stage = ans.stage;

  ans = await inquirer.prompt({
    type: "list",
    name: "region",
    message: "Select AWS Region:",
    choices: awsRegionNames,
    default: "Asia Pacific (Singapore)",
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
    message: "Select AWS Profile:",
    choices: awsProfiles,
    default: "default",
    when: () => !profile
  });

  if (ans.profile) profile = ans.profile;
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

const start = async () => {
  while (!name || !email || !password || !region || !profile || !stage) {
    await askAWSQuestions();
    await askUserQuestions();
  }

  return {
    user: { name, email, password, role },
    aws: { region, profile, stage },
    jwt_secret
  };
};

module.exports = start;
