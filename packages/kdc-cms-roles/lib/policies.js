const { ROLE_DEV, ROLE_ADMIN, ROLE_APP } = require("./roles");

/**
 * Format: {httpVerb}/[{resource}/[{child-resources}]]
 */
const resources = {
  [ROLE_DEV]: "*",
  [ROLE_ADMIN]: [
    "*/pages",
    "*/pages/*",
    "*/contents",
    "*/contents/*",
    "*/users",
    "*/users/*",
    "*/upload",
    "*/upload/*"
  ],
  [ROLE_APP]: ["GET/pages", "GET/pages/*", "GET/contents", "GET/contents/*"]
};

/**
 * Resource format:
 * arn:aws:execute-api:{regionId}:{accountId}:{apiId}/{stage}/{httpVerb}/[{resource}/[{child-resources}]]
 *
 * Source: https://docs.aws.amazon.com/en_pv/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 */
const getResource = (role, resource) => {
  const [, rootArn, appId, stage] = resource.match(
    /^(\S+:)([^/]+)\/([^/]+)\/([^/]+)\/(.*)/i
  );

  if (!resources[role]) return null;

  const res = resources[role];
  if (!Array.isArray(res)) return res;

  return res.map(r => {
    return `${rootArn}${appId}/${stage}/${r}`;
  });
};

const generatePolicy = (user, effect, resource) => {
  const authResponse = {
    context: { ...user },
    principalId: user.username
  };

  if (effect && resource) {
    const statementOne = {
      Action: "execute-api:Invoke",
      Effect: effect,
      Resource: getResource(user.role, resource)
    };

    const policyDocument = {
      Version: "2012-10-17",
      Statement: [statementOne]
    };

    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

module.exports = { generatePolicy };
