/**
 * Use custom API Gateway Lambda Authorizer
 * Tutorial: https://docs.aws.amazon.com/en_pv/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
 */

import jwt from 'jsonwebtoken';
import get from './lib/get';
import getResource from './lib/resource';

const generatePolicy = (user, effect, resource) => {
  const authResponse = {
    context: { ...user },
    principalId: user.username
  };

  if (effect && resource) {
    const statementOne = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: getResource(user.role, resource)
    };

    const policyDocument = {
      Version: '2012-10-17',
      Statement: [statementOne]
    };

    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

const handler = (event, context, callback) => {
  // Check header or url parameters or post parameters for token
  const bearer = event.authorizationToken;
  if (!bearer) return callback(null, 'Unauthorized');

  const token = bearer.substr(String('Bearer ').length);

  // Verifies secret and checks exp
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      callback(null, 'Unauthorized');
      return;
    }

    const { sub } = decoded;
    // Check whether user ID is legit in the DB
    get({ username: sub }, { raw: true }).then(user => {
      const { pk: username, role } = user;

      // If the user id exists in the db, save to request for use in other routes
      if (user)
        return callback(
          null,
          generatePolicy(
            {
              username,
              role
            },
            'Allow',
            event.methodArn
          )
        );

      // Otherwise return an error
      return callback(null, 'Unauthorized');
    });
  });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
