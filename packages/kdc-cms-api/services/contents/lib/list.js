import { DDB } from 'kdc-cms-dynamodb';
import { success, failure } from '../../../lib/response';
import remap from '../../../lib/remap';
import fieldMap from './map';
import defGet from '../../define/contents/lib/get';

export default async (id, { limit, start }) => {
  const definition = await defGet({ id }, { raw: true });
  const { sortKey } = definition;
  const ExpressionAttributeNames = { '#Name': 'Name' };
  let ProjectionExpression = 'pk, gs1sk, #Name, createdAt, updatedAt';
  let KeyConditionExpression = 'gs1pk = :pk';
  const ExpressionAttributeValues = { ':pk': `content#${id}` };

  if (sortKey !== 'Name') {
    ExpressionAttributeNames['#sort'] = sortKey;
    ProjectionExpression += ', #sort';
  }

  if (start) {
    KeyConditionExpression += ' and gs1sk < :sk';
    ExpressionAttributeValues[':sk'] = start;
  }

  const params = {
    IndexName: 'GS1',
    KeyConditionExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
    ProjectionExpression,
    ScanIndexForward: false,
    Limit: parseInt(limit, 10) || 10,
    ReturnConsumedCapacity: 'TOTAL'
  };

  try {
    const data = await DDB('query', params);
    const list = data.Items.map(i => {
      const map = { ...fieldMap };
      const { sortKeyUsed, ...attr } = i;
      map.gs1sk = sortKeyUsed;
      return remap(attr, map);
    });

    let next = null;
    if (data.LastEvaluatedKey && data.LastEvaluatedKey.gs1sk) {
      next = data.LastEvaluatedKey.gs1sk;
    }
    return success({ list, next });
  } catch (e) {
    return failure(500, e);
  }
};
