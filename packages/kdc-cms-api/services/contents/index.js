import { ROLE_APP } from 'kdc-cms-roles';
import get from './lib/get';
import create from './lib/create';
import list from './lib/list';
import update from './lib/update';
import del from './lib/delete';
import parseParams from '../../lib/parseParams';
import { failure } from '../../lib/response';

const handler = async event => {
  const {
    httpMethod,
    pathParameters,
    body,
    queryStringParameters,
    requestContext: { authorizer }
  } = event;
  const params = parseParams(pathParameters, ['typeId', 'contentId']);

  if (!params || !params.typeId) {
    return failure(400, { error: 'Invalid request' });
  }

  const { typeId } = params;
  if (params.contentId) {
    const { contentId } = params;
    if (httpMethod === 'GET') {
      return get({ typeId, contentId });
    }

    if (httpMethod === 'PUT' && body) {
      const attr = JSON.parse(body);
      return update({ typeId, contentId, attr });
    }

    if (httpMethod === 'DELETE') {
      return del({ typeId, contentId });
    }
  }

  if (httpMethod === 'GET') {
    const { role } = authorizer;
    if (role === ROLE_APP) {
      return list(typeId, { ...queryStringParameters, allFields: true });
    }
    return list(typeId, queryStringParameters || {});
  }

  if (httpMethod === 'POST' && body) {
    const attr = JSON.parse(body);
    return create({ typeId, ...attr });
  }

  return failure(400, { error: 'Invalid request' });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
