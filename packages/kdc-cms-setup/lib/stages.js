const stagesMappings = {
  local: "Local Development",
  dev: "Development on AWS",
  staging: "Staging on AWS",
  prod: "Production on AWS"
};

module.exports = {
  stages: Object.keys(stagesMappings),
  stageNames: Object.keys(stagesMappings).map(k => stagesMappings[k]),
  mappings: stagesMappings
};
