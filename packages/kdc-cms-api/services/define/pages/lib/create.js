import DDB from '../../../../lib/dynamodb';
import { successPOST, failure } from '../../../../lib/response';

export default async ({ name, id, ...attr }) => {
  const createdAt = new Date().valueOf();
  const Item = {
    pk: id,
    sk: 'page',
    gs1pk: 'page',
    gs1sk: name,
    ...attr,
    createdAt
  };

  const params = {
    Item,
    ConditionExpression: 'attribute_not_exists(pk)'
  };

  try {
    await DDB('put', params);
    return successPOST({ id });
  } catch (e) {
    return failure(500, e);
  }
};
