import { DDB } from 'kdc-cms-dynamodb';
import { successPUT, failure } from '../../../../lib/response';
import get from './get';

export default async ({ id, attr }) => {
  const page = await get({ id }, { raw: true });
  const { name, ...otherAttr } = attr;

  const updatedAt = new Date().valueOf();
  const Item = {
    pk: id,
    sk: 'page',
    gs1pk: 'page',
    gs1sk: name || page.gs1sk,
    createdAt: page.createdAt,
    ...otherAttr,
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
