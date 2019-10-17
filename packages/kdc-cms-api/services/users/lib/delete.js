import DDB from '../../../lib/dynamodb';
import { successDEL, failure } from '../../../lib/response';

export default async ({ username }) => {
  const params = {
    Key: { pk: username, sk: 'user' }
  };

  try {
    await DDB('delete', params);
    return successDEL();
  } catch (e) {
    return failure(500, e);
  }
};
