import get from './lib/get';
import create from './lib/create';
import list from './lib/list';
import update from './lib/update';
import del from './lib/delete';
import parseParams from '../../lib/parseParams';
import { failure } from '../../lib/response';

const handler = async event => {
  const { httpMethod, pathParameters, body, queryStringParameters } = event;
  const params = parseParams(pathParameters, ['id', 'slug']);

  if (!params || !params.id) {
    return failure(400, { error: 'Invalid request' });
  }

  const { id } = params;
  if (params.slug) {
    const { slug } = params;
    if (httpMethod === 'GET') {
      return get({ id, slug });
    }

    if (httpMethod === 'PUT' && body) {
      const attr = JSON.parse(body);
      return update({ id, slug, attr });
    }

    if (httpMethod === 'DELETE') {
      return del({ id, slug });
    }
  }

  if (httpMethod === 'GET') {
    return list(id, queryStringParameters || {});
  }

  if (httpMethod === 'POST' && body) {
    const attr = JSON.parse(body);
    return create({ id, ...attr });
  }

  return failure(400, { error: 'Invalid request' });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
