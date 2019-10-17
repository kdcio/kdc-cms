import DDB from '../../../lib/dynamodb';
import { successPOST, failure } from '../../../lib/response';
import defGet from '../../define/pages/lib/get';
import get from './get';

export default async ({ name, id, ...attr }) => {
  const current = await get({ id }, { raw: true });
  if (current) {
    return failure(409, {
      error: 'PageExists',
      message: 'Page already exists',
      id
    });
  }

  const definition = await defGet({ id }, { raw: true });
  const validAttr = {};
  definition.fields.forEach(f => {
    if (attr[f.name]) {
      validAttr[f.name] = attr[f.name];
    }
  });

  const createdAt = new Date().valueOf();
  const Item = {
    pk: id,
    sk: 'page#data',
    gs1pk: 'page#data',
    gs1sk: definition.gs1sk,
    ...validAttr,
    createdAt
  };

  const params = { Item };

  try {
    await DDB('put', params);
    return successPOST({ id });
  } catch (e) {
    return failure(500, e);
  }
};
