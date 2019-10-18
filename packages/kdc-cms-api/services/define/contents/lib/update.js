import { DDB } from 'kdc-cms-dynamodb';
import { successPUT, failure } from '../../../../lib/response';
import get from './get';

export default async ({ id, attr }) => {
  const content = await get({ id }, { raw: true });
  const { name, ...otherAttr } = attr;

  const updatedAt = new Date().valueOf();
  const Item = {
    ...content,
    ...otherAttr,
    gs1sk: name || content.gs1sk,
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
