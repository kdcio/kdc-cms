import get from './get';
import create from './create';
import list from './list';
import update from './update';
import del from './delete';
import parseParams from '../../lib/parseParams';
import failure from '../../lib/response';

exports.handler = async event => {
  console.log(event);

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
