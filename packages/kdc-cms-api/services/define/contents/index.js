import get from './lib/get';
import create from './lib/create';
import list from './lib/list';
import update from './lib/update';
import del from './lib/delete';
import parseParams from '../../../lib/parseParams';
import { failure } from '../../../lib/response';

const handler = async event => {
  const { httpMethod, pathParameters, body } = event;
  const params = parseParams(pathParameters, ['id']);

  if (params && params.id) {
    const { id } = params;
    if (httpMethod === 'GET') {
      return get({ id });
    }

    if (httpMethod === 'PUT' && body) {
      const attr = JSON.parse(body);
      return update({ id, attr });
    }

    if (httpMethod === 'DELETE') {
      return del({ id });
    }
  }

  if (httpMethod === 'GET') {
    return list();
  }

  if (httpMethod === 'POST' && body) {
    const attr = JSON.parse(body);
    return create(attr);
  }

  return failure(400, { error: 'Invalid request' });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
