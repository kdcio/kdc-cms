import { DDB } from 'kdc-cms-dynamodb';
import { success, failure } from '../../../../lib/response';
import remap from '../../../../lib/remap';
import fieldMap from './map';

export default async () => {
  const params = {
    IndexName: 'GS1',
    KeyConditionExpression: 'gs1pk = :pk',
    ExpressionAttributeValues: {
      ':pk': 'content'
    },
    ExpressionAttributeNames: {
      '#fields': 'fields'
    },
    ProjectionExpression:
      'pk, gs1sk, description, fieldCount, #fields, sortKey, createdAt, updatedAt, docCount'
  };

  try {
    const data = await DDB('query', params);
    return success(data.Items.map(i => remap(i, fieldMap)));
  } catch (e) {
    return failure(500, e);
  }
};
