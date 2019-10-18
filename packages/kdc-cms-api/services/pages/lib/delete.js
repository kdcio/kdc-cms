import { DDB } from 'kdc-cms-dynamodb';
import { successDEL, failure } from '../../../lib/response';

export default async ({ id }) => {
  const params = {
    Key: { pk: id, sk: 'page#data' }
  };

  try {
    await DDB('delete', params);
    return successDEL();
  } catch (e) {
    return failure(500, e);
  }
};
