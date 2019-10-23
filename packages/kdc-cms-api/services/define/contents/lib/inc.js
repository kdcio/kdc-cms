import { DDB } from 'kdc-cms-dynamodb';

export default async ({ id, inc }) => {
  const params = {
    Key: { pk: id, sk: 'content' },
    UpdateExpression: 'ADD #ctr :inc',
    ExpressionAttributeNames: { '#ctr': 'docCount' },
    ExpressionAttributeValues: { ':inc': inc }
  };

  return DDB('update', params);
};
