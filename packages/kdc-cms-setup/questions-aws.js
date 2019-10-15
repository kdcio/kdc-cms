const inquirer = require("inquirer");
const {
  regions: awsRegions,
  regionNames: awsRegionNames
} = require("./aws-regions");
const awsProfiles = require("./aws-profiles");
const indexOf = require("lodash.indexof");

let region = null;
let profile = null;

const askAWSQuestions = async () => {
  let ans = await inquirer.prompt({
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

const start = async ctx => {
  const { stage } = ctx;
  if (stage === "local") {
    return ctx;
  }

  while (!region || !profile) {
    await askAWSQuestions();
  }

  return {
    ...ctx,
    aws: { region, profile }
  };
};

module.exports = start;
