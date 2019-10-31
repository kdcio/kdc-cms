import { DDB } from 'kdc-cms-dynamodb';
import { successDEL, failure } from '../../../lib/response';
import get from './get';
import defGet from '../../define/contents/lib/get';

export default async ({ typeId, contentId }) => {
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

  const params = {
    TransactItems: [
      {
        Delete: { Key: { pk: contentId, sk: `content#${typeId}` } }
      }
    ]
  };

  definition.fields.forEach(f => {
    if (!f.unique) return;
    params.TransactItems.push({
      Delete: {
        Key: {
          pk: `content#${typeId}#${f.name}#${current[f.name]}`,
          sk: `content#${typeId}#${f.name}`
        }
      }
    });
  });

  params.TransactItems.push({
    Update: {
      Key: { pk: typeId, sk: 'content' },
      UpdateExpression: 'ADD #ctr :inc',
      ExpressionAttributeNames: { '#ctr': 'docCount' },
      ExpressionAttributeValues: { ':inc': -1 }
    }
  });

  try {
    await DDB('transactWrite', params);

    return successDEL();
  } catch (e) {
    return failure(500, e);
  }
};
