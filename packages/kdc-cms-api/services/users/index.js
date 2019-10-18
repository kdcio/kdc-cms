import get from './lib/get';
import create from './lib/create';
import list from './lib/list';
import update from './lib/update';
import del from './lib/delete';
import me from './lib/me';
import parseParams from '../../lib/parseParams';
import { failure } from '../../lib/response';

const handler = async event => {
  const { httpMethod, pathParameters, body } = event;
  const params = parseParams(pathParameters, ['username']);

  if (params && params.username) {
    const { username } = params;

    if (httpMethod === 'GET' && username === 'me') {
      return me(event);
    }

    if (httpMethod === 'GET') {
      return get({ username });
    }

    if (httpMethod === 'PUT' && body) {
      const attr = JSON.parse(body);
      return update({ username, attr });
    }

    if (httpMethod === 'DELETE') {
      return del({ username });
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
