const inquirer = require("inquirer");
const validator = require("validator");
const {
  regions: awsRegions,
  regionNames: awsRegionNames
} = require("./aws-regions");
const awsProfiles = require("./aws-profiles");
const indexOf = require("lodash.indexof");

const start = async ctx => {
  const { stage } = ctx;
  if (stage === "local") {
    return ctx;
  }

  const ans = await inquirer.prompt([
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
      message: "Enter your API endpoint:",
      name: "apiUrl",
      default: function(answers) {
        if (stage === "prod" || stage === "production") {
          return `api.${answers.domain}`;
        } else {
          return `api-${stage}.${answers.domain}`;
        }
      },
      validate: function(value, answers) {
        if (validator.isFQDN(value)) {
          return true;
        } else {
          return `Please enter a valid endpoint. Example: api-${stage}.${answers.domain}`;
        }
      },
      when: function(answers) {
        // Only run if user set a name
        return !!answers.domain;
      }
    },
    {
      type: "confirm",
      message: "Do you want to use CloudFront for your API endpoint?",
      name: "apiUrlCF",
      default: false
    },
    {
      type: "input",
      message: "Enter your CMS endpoint:",
      name: "adminUrl",
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
      type: "confirm",
      message: "Do you want to use CloudFront for your CMS endpoint?",
      name: "adminUrlCF",
      default: false
    }
  ]);

  return {
    ...ctx,
    aws: { ...ans }
  };
};

module.exports = start;
