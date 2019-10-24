import { DDB } from 'kdc-cms-dynamodb';
import { ROLE_APP } from 'kdc-cms-roles';
import { success, failure } from '../../../lib/response';
import remap from '../../../lib/remap';
import fieldMap from './map';

export default async (opts = {}) => {
  const { role } = opts;
  const params = {
    IndexName: 'GS1',
    KeyConditionExpression: 'gs1pk = :pk',
    ExpressionAttributeValues: {
      ':pk': 'user'
    },
    ExpressionAttributeNames: {
      '#role': 'role'
    },
    ProjectionExpression: 'pk, gs1sk, #role, createdAt, updatedAt'
  };

  if (role && role === ROLE_APP) {
    params.ExpressionAttributeValues[':pk'] = 'user#app';
  }

  try {
    const data = await DDB('query', params);
    return success(data.Items.map(i => remap(i, fieldMap)));
  } catch (e) {
    return failure(500, e);
  }
};
