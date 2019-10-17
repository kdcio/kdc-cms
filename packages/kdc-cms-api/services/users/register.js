import parseParams from '../../lib/parseParams';
import { failure } from '../../lib/response';
import create from './lib/create';

const handler = async event => {
  const { pathParameters, body } = event;
  const params = parseParams(pathParameters, ['role']);

  if (params && params.role && body) {
    const { role } = params;
    if (!(role === 'public' || role === 'adviser')) {
      return failure(400, { error: 'InvalidRequest' });
    }

    try {
      const attr = JSON.parse(body);
      if (attr.username && attr.password && attr.email && attr.name) {
        return create({ ...attr, role });
      }
    } catch (e) {
      return failure(400, { error: 'InvalidRequest' });
    }
  }

  return failure(400, { error: 'InvalidRequest' });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
