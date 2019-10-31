import { DDB } from 'kdc-cms-dynamodb';
import { successPUT, failure } from '../../../lib/response';
import get from './get';
// import del from './delete';
// import create from './create';
import defGet from '../../define/contents/lib/get';

export default async ({ typeId, contentId, attr }) => {
  const updatedAt = new Date().valueOf();
  const current = await get({ typeId, contentId }, { raw: true });
  if (!current) {
    return failure(404, {
      error: 'ContentNotFound',
      message: 'Content not found',
      typeId
    });
  }

  const definition = await defGet({ id: typeId }, { raw: true });
  if (!definition) {
    return failure(404, {
      error: 'ContentDefinitionNotFound',
      message: 'Content definition not found',
      typeId
    });
  }

  const deleteItems = [];
  const uniqueItems = [];
  const validAttr = {};
  definition.fields.forEach(f => {
    if (attr[f.name] === undefined) {
      return;
    }
    validAttr[f.name] = attr[f.name];
    if (!f.unique) return;
    if (attr[f.name] === current[f.name]) return;

    // delete old
    deleteItems.push({
      Delete: {
        Key: {
          pk: `content#${typeId}#${f.name}#${current[f.name]}`,
          sk: `content#${typeId}#${f.name}`
        }
      }
    });

    // create new
    uniqueItems.push({
      Put: {
        ConditionExpression: 'attribute_not_exists(pk)',
        Item: {
          pk: `content#${typeId}#${f.name}#${attr[f.name]}`,
          sk: `content#${typeId}#${f.name}`,
          name: f.name
        }
      }
    });
  });

  const sortKey = validAttr[definition.sortKey];
  if (!sortKey) {
    return failure(400, {
      error: 'SortKeyInvalid',
      message: 'Sort key cannot be blank'
    });
  }

  const Item = {
    pk: contentId,
    sk: `content#${typeId}`,
    gs1pk: `content#${typeId}`,
    gs1sk: sortKey,
    createdAt: current.createdAt,
    sortKeyUsed: definition.sortKey,
    ...validAttr,
    updatedAt
  };

  const params = {
    TransactItems: [
      {
        Put: { Item }
      },
      ...uniqueItems,
      ...deleteItems
    ]
  };

  try {
    await DDB('transactWrite', params);
    return successPUT();
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
          message: 'Unique already exists',
          uniqueKey: uniqueItems[k - 1].Put.Item.name
        };
      }
    });

    return failure(409, err);
  }
};
