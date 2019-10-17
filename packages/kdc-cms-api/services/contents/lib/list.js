import DDB from '../../../lib/dynamodb';
import { success, failure } from '../../../lib/response';
import remap from '../../../lib/remap';
import fieldMap from './map';

export default async id => {
  const params = {
    IndexName: 'GS1',
    KeyConditionExpression: 'gs1pk = :pk',
    ExpressionAttributeValues: {
      ':pk': `content#${id}`
    },
    ExpressionAttributeNames: {
      '#Name': 'Name'
    },
    ProjectionExpression: 'pk, gs1sk, #Name, createdAt, updatedAt, sortKeyUsed',
    ScanIndexForward: false
  };

  try {
    const data = await DDB('query', params);
    return success(
      data.Items.map(i => {
        const map = { ...fieldMap };
        const { sortKeyUsed, ...attr } = i;
        map.gs1sk = sortKeyUsed;
        return remap(attr, map);
      })
    );
  } catch (e) {
    return failure(500, e);
  }
};
