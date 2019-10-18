import { DDB } from 'kdc-cms-dynamodb';
import { successPOST, failure } from '../../../../lib/response';
import get from './get';

export default async ({ name, id, ...attr }) => {
  const current = await get({ id }, { raw: true });
  if (current) {
    if (current.statusCode) return current;
    return failure(409, {
      error: 'PageDefinitionExists',
      message: 'Page definition already exists',
      id
    });
  }

  const createdAt = new Date().valueOf();
  const Item = {
    pk: id,
    sk: 'page',
    gs1pk: 'page',
    gs1sk: name,
    ...attr,
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
