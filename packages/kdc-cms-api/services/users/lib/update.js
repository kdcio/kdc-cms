import { DDB } from 'kdc-cms-dynamodb';
import { successPUT, failure } from '../../../lib/response';
import get from './get';

export default async ({ username, attr }) => {
  const current = await get({ username }, { raw: true });
  const { name, ...otherAttr } = attr;

  const updatedAt = new Date().valueOf();
  const Item = {
    ...current,
    ...otherAttr,
    gs1sk: name || current.gs1sk,
    updatedAt
  };

  const params = { Item };

  try {
    await DDB('put', params);
    return successPUT();
  } catch (e) {
    return failure(500, e);
  }
};
