/**
 * Resource format:
 * arn:aws:execute-api:{regionId}:{accountId}:{apiId}/{stage}/{httpVerb}/[{resource}/[{child-resources}]]
 *
 * Source: https://docs.aws.amazon.com/en_pv/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 */

// format: {httpVerb}/[{resource}/[{child-resources}]]
const resources = {
  dev: '*',
  admin: [
    '*/pages',
    '*/pages/*',
    '*/contents',
    '*/contents/*',
    '*/users',
    '*/users/*',
    '*/upload',
    '*/upload/*'
  ],
  application: ['GET/pages', 'GET/pages/*', 'GET/contents', 'GET/contents/*'],
  public: ['POST/review', 'PUT/users/me'],
  adviser: ['PUT/users/me']
};

const getResource = (role, resource) => {
  const [, rootArn, appId, stage] = resource.match(/^(\S+:)([^/]+)\/([^/]+)\/([^/]+)\/(.*)/i);

  if (!resources[role]) return null;

  const res = resources[role];
  if (!Array.isArray(res)) return res;

  return res.map(r => {
    return `${rootArn}${appId}/${stage}/${r}`;
  });
};

export default getResource;
