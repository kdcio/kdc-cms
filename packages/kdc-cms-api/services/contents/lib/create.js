import { DDB } from 'kdc-cms-dynamodb';
import uuid from 'uuid';
import { successPOST, failure } from '../../../lib/response';
import defGet from '../../define/contents/lib/get';

export default async ({ typeId, ...attr }) => {
  const definition = await defGet({ id: typeId }, { raw: true });
  if (!definition) {
    return failure(400, {
      error: 'ContentDefinitionNotFound',
      message: 'Content definition not found',
      typeId
    });
  }

  const uniqueItems = [];
  const validAttr = {};
  definition.fields.forEach(f => {
    if (attr[f.name] === undefined) {
      return;
    }
    validAttr[f.name] = attr[f.name];
    if (!f.unique) return;
    uniqueItems.push({
      pk: `content#${typeId}#${f.name}#${attr[f.name]}`,
      sk: `content#${typeId}#${f.name}`,
      gs1pk: `content#${typeId}#${f.name}`,
      gs1sk: f.name,
      name: f.name
    });
  });

  if (attr.createdAt) {
    validAttr.createdAt = attr.createdAt;
  }
  if (attr.updatedAt) {
    validAttr.updatedAt = attr.updatedAt;
  }

  const sortKey = validAttr[definition.sortKey];
  if (!sortKey) {
    return failure(400, {
      error: 'SortKeyInvalid',
      message: 'Sort key cannot be blank',
      sortKey: definition.sortKey
    });
  }

  const nameKey = validAttr[definition.nameKey];
  if (!nameKey) {
    return failure(400, {
      error: 'NameKeyInvalid',
      message: 'Name key cannot be blank.',
      nameKey: definition.nameKey
    });
  }

  const createdAt = new Date().valueOf();
  const Item = {
    pk: uuid.v4(),
    sk: `content#${typeId}`,
    gs1pk: `content#${typeId}`,
    gs1sk: sortKey,
    sortKeyUsed: definition.sortKey,
    createdAt,
    ...validAttr
  };

  const params = {
    TransactItems: [
      {
        Put: { Item }
      }
    ]
  };

  uniqueItems.forEach(u => {
    const uniqueReq = {
      Put: {
        ConditionExpression: 'attribute_not_exists(pk)',
        Item: u
      }
    };
    params.TransactItems.push(uniqueReq);
  });

  params.TransactItems.push({
    Update: {
      Key: { pk: typeId, sk: 'content' },
      UpdateExpression: 'ADD #ctr :inc',
      ExpressionAttributeNames: { '#ctr': 'docCount' },
      ExpressionAttributeValues: { ':inc': 1 }
    }
  });

  try {
    await DDB('transactWrite', params);

    return successPOST({ id: Item.pk });
  } catch (e) {
    const errs = e.message.match(/.*\[(.*)\]/);
    if (!errs) {
      return failure(500, e);
    }

    let err = { error: 'UnknownError', message: 'Unknown error', e };
    errs[1].split(', ').forEach((con, k) => {
      if (k > 0 && con === 'ConditionalCheckFailed') {
        err = {
          error: 'UniqueExists',
          message: 'Unique value exists',
          uniqueKey: uniqueItems[k - 1].name
        };
      }
    });

    return failure(409, err);
  }
};
