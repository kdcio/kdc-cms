import { DDB } from 'kdc-cms-dynamodb';
import { successPUT, failure } from '../../../lib/response';
import get from './get';
// import del from './delete';
// import create from './create';
import defGet from '../../define/contents/lib/get';

export default async ({ typeId, contentId, attr }) => {
  const updatedAt = new Date().valueOf();
  const current = await get({ typeId, contentId }, { raw: true });
  // TODO: make slug unique
  // if (attr.Slug && slug !== attr.Slug) {
  //   await del({ typeId, id: contentId });
  //   return create({
  //     typeId,
  //     ...current,
  //     ...attr,
  //     updatedAt
  //   });
  // }

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
    if (attr[f.name]) {
      validAttr[f.name] = attr[f.name];
    }
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

  const params = { Item };

  try {
    await DDB('put', params);
    return successPUT();
  } catch (e) {
    return failure(500, e);
  }
};
