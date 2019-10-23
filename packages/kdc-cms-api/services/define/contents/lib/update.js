import { DDB } from 'kdc-cms-dynamodb';
import { successPUT, failure } from '../../../../lib/response';
import get from './get';

export default async ({ id, attr }) => {
  const content = await get({ id }, { raw: true });
  const { name, ...otherAttr } = attr;

  const updatedAt = new Date().valueOf();
  const Item = {
    pk: id,
    sk: 'content',
    gs1pk: 'content',
    gs1sk: name || content.gs1sk,
    createdAt: content.createdAt,
    ...otherAttr,
    docCount: content.docCount,
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
