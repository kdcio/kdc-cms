import blogs from './lib/blogs';
import pages from './lib/pages';
import parseParams from '../../lib/parseParams';
import { success, failure } from '../../lib/response';

const handler = async event => {
  const { httpMethod, pathParameters } = event;
  const params = parseParams(pathParameters, ['path']);

  if (params && params.path) {
    const { path } = params;
    if (httpMethod === 'GET' && path === 'blogs') {
      await blogs();
      return success({ type: path });
    }

    if (httpMethod === 'GET' && path === 'pages') {
      await pages();
      return success({ type: path });
    }
  }

  return failure(400, { error: 'Invalid request' });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
