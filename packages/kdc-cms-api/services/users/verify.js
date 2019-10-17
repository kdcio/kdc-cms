import jwt from 'jsonwebtoken';
import get from './lib/get';

const generatePolicy = (user, effect, resource) => {
  const authResponse = {
    context: { ...user },
    principalId: user.username
  };

  if (effect && resource) {
    const statementOne = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      /**
       * Specifying resource will only allow the policy
       * for that specific resource. We use wildcard so that
       * it policy spans to multiple services.
       */

      Resource: '*' // resource
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
  console.log(token);

  // Verifies secret and checks exp
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return callback(null, 'Unauthorized');
    }

    const { sub } = decoded;
    // Check whether user ID is legit in the DB
    return get({ username: sub }, { raw: true }).then(user => {
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
