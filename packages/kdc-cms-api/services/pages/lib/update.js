import { DDB } from 'kdc-cms-dynamodb';
import { successPUT, failure } from '../../../lib/response';
import get from './get';
import defGet from '../../define/pages/lib/get';

export default async ({ id, name, attr }) => {
  const current = await get({ id }, { raw: true });
  const definition = await defGet({ id }, { raw: true });
  const validAttr = {};
  definition.fields.forEach(f => {
    if (attr[f.name]) {
      validAttr[f.name] = attr[f.name];
    }
  });

  const updatedAt = new Date().valueOf();
  const Item = {
    ...current,
    ...validAttr,
    gs1sk: name || definition.gs1sk,
    updatedAt
  };

  const params = {
    Item
  };

  try {
    await DDB('put', params);
    return successPUT();
  } catch (e) {
    return failure(500, e);
  }
};
