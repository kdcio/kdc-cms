import { failure } from '../../lib/response';
import auth from './lib/authenticate';

const handler = async event => {
  const { body } = event;

  if (body) {
    try {
      const attr = JSON.parse(body);
      if (attr.username && attr.password) {
        return auth(attr);
      }
    } catch (e) {
      return failure(400, { error: 'Invalid request' });
    }
  }

  return failure(400, { error: 'Invalid request' });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
