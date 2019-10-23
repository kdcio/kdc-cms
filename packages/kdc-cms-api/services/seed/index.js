import blogs from './lib/blogs';
import parseParams from '../../lib/parseParams';
import { success, failure } from '../../lib/response';

const handler = async event => {
  const { httpMethod, pathParameters } = event;
  const params = parseParams(pathParameters, ['path', 'count']);

  if (params && params.path) {
    const { path, count } = params;
    if (httpMethod === 'GET' && path === 'blogs') {
      const max = await blogs(count);
      return success({ type: path, count: max });
    }
  }

  return failure(400, { error: 'Invalid request' });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
