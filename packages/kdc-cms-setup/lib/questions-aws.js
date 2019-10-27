const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const validator = require("validator");
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
    },
    {
      type: "input",
      message: "Enter your CMS S3 Bucket:",
      name: "cmsBucket",
      default: function(answers) {
        if (stage === "prod" || stage === "production") {
          return `admin.${answers.domain}`;
        } else {
          return `admin-${stage}.${answers.domain}`;
        }
      },
      validate: function(value, answers) {
        if (validator.isFQDN(value)) {
          return true;
        } else {
          return `Please enter a valid endpoint. Example: admin-${stage}.${answers.domain}`;
        }
      },
      when: function(answers) {
        // Only run if user set a name
        return !!answers.domain;
      }
    },
    {
      type: "input",
      message: "Enter your Image Upload S3 bucket:",
      name: "uploadBucket",
      default: function(answers) {
        if (stage === "prod" || stage === "production") {
          return `uploads.${answers.domain}`;
        } else {
          return `uploads-${stage}.${answers.domain}`;
        }
      },
      validate: function(value, answers) {
        if (validator.isFQDN(value)) {
          return true;
        } else {
          return `Please enter a valid endpoint. Example: uploads-${stage}.${answers.domain}`;
        }
      },
      when: function(answers) {
        // Only run if user set a name
        return !!answers.domain;
      }
    }
  ]);

  return {
    ...ctx,
    aws: { ...ans }
  };
};

module.exports = start;
