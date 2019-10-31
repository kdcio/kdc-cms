import { DDB } from 'kdc-cms-dynamodb';
import uuid from 'uuid';
import { successPOST, failure } from '../../../lib/response';
import defGet from '../../define/contents/lib/get';
import inc from '../../define/contents/lib/inc';

export default async ({ typeId, ...attr }) => {
  const definition = await defGet({ id: typeId }, { raw: true });
  if (!definition) {
    return failure(400, {
      error: 'ContentDefinitionNotFound',
      message: 'Content definition not found',
      typeId
    });
  }

  const validAttr = {};
  definition.fields.forEach(f => {
    if (attr[f.name] !== undefined) {
      validAttr[f.name] = attr[f.name];
    }
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

  const params = { Item };

  try {
    await DDB('put', params);
    // increment count in definition
    await inc({ id: typeId, inc: 1 });

    return successPOST({ id: Item.pk });
  } catch (e) {
    return failure(500, e);
  }
};
