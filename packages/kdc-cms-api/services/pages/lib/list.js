import { DDB } from 'kdc-cms-dynamodb';
import { success, failure } from '../../../lib/response';
import remap from '../../../lib/remap';
import fieldMap from './map';

export default async ({ limit, allFields }) => {
  const ProjectionExpression = 'pk, gs1sk, createdAt, updatedAt';
  const params = {
    IndexName: 'GS1',
    KeyConditionExpression: 'gs1pk = :pk',
    ExpressionAttributeValues: {
      ':pk': 'page#data'
    },
    Limit: parseInt(limit, 10) || 5
  };

  if (!allFields) {
    params.ProjectionExpression = ProjectionExpression;
  }

  try {
    const data = await DDB('query', params);
    const list = data.Items.map(i => remap(i, fieldMap));
    return success({ list });
  } catch (e) {
    return failure(500, e);
  }
};
