import DDB from '../../../../lib/dynamodb';
import { successDEL, failure } from '../../../../lib/response';

export default async ({ id }) => {
  const params = {
    Key: { pk: id, sk: 'content' }
  };

  try {
    await DDB('delete', params);
    return successDEL();
  } catch (e) {
    return failure(500, e);
  }
};
