const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const validator = require("validator");
const kebabCase = require("lodash.kebabcase");
const {
  regions: awsRegions,
  regionNames: awsRegionNames
} = require("./aws-regions");
const awsProfiles = require("./aws-profiles");
const indexOf = require("lodash.indexof");
const rootDir = path.resolve(__dirname, "../../../");

const start = async ctx => {
  const { stage } = ctx;

  console.log(`Setting up STAGE: ${chalk.green.bold(stage)}\n`);

  if (stage === "local") {
    return ctx;
  }

  let ans = {};
  let configFileExists = false;
  const configFile = path.resolve(rootDir, `config.${stage}.yml`);
  try {
    fs.statSync(configFile);
    configFileExists = true;
  } catch (error) {}

  if (configFileExists) {
    console.log(
      chalk.bold("=================================") +
        chalk.red.bold(" WARNING!!! ") +
        chalk.bold("=================================\n\n") +
        `'${chalk.bold.red(
          `config.${stage}.yml`
        )}' exist. This mean you've run setup for this stage before.\n` +
        `Continuing means the file contents will be delete and you'll lose control\n` +
        `over the previous setup.\n`
    );

    ans = await inquirer.prompt([
      {
        type: "confirm",
        message: `Are you sure you want to continue?`,
        name: "configOverwrite",
        default: false
      }
    ]);

    if (!ans.configOverwrite) {
      return Promise.reject(new Error("Config already exists"));
    }
  }

  ans = await inquirer.prompt([
    {
      type: "list",
      name: "region",
      message: "Select AWS Region:",
      choices: awsRegionNames,
      default: "Asia Pacific (Singapore)",
      filter: val => {
        const k = indexOf(awsRegionNames, val);
        return awsRegions[k];
      }
    },
    {
      type: "list",
      name: "profile",
      message: "Select AWS Profile:",
      choices: awsProfiles,
      default: "default"
    },
    {
      type: "input",
      message: "Enter your domain name:",
      name: "domain",
      validate: function(value) {
        if (validator.isFQDN(value)) {
          return true;
        } else {
          return "Please enter a valid domain name";
        }
      }
    }
  ]);

  let aws = { ...ans };
  console.log(
    "For S3 buckets, it will only accept letters, numbers and dash to avoid SSL errors when uploading files via CMS."
  );
  ans = await inquirer.prompt([
    {
      type: "input",
      message: "Enter your CMS S3 Bucket:",
      name: "cmsBucket",
      default: function() {
        return kebabCase(`admin-${stage}.${aws.domain}`);
      },
      validate: function(value) {
        if (validator.matches(value, /^[a-zA-Z0-9-]+$/)) {
          return true;
        } else {
          return `Only letters, numbers and dash are accepted to avoid SSL error in S3. Example: ${kebabCase(
            `admin-${stage}.${aws.domain}`
          )}`;
        }
      },
      when: function() {
        return !!aws.domain;
      }
    },
    {
      type: "input",
      message: "Enter your Image Upload S3 bucket:",
      name: "uploadBucket",
      default: function() {
        return kebabCase(`uploads-${stage}.${aws.domain}`);
      },
      validate: function(value) {
        if (validator.matches(value, /^[a-zA-Z0-9-]+$/)) {
          return true;
        } else {
          return `Only letters, numbers and dash are accepted to avoid SSL error in S3. Example: ${kebabCase(
            `uploads-${stage}.${aws.domain}`
          )}`;
        }
      },
      when: function() {
        return !!aws.domain;
      }
    }
  ]);

  return {
    ...ctx,
    aws: { ...aws, ...ans }
  };
};

module.exports = start;
