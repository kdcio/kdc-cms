import DDB from '../../../lib/dynamodb';
import { successPOST, failure } from '../../../lib/response';
import defGet from '../../define/pages/lib/get';

export default async ({ name, id, ...attr }) => {
  const definition = await defGet({ id }, { raw: true });
  console.log(definition);

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
