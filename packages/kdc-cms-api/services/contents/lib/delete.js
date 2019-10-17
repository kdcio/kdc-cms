import DDB from '../../../lib/dynamodb';
import { successDEL, failure } from '../../../lib/response';

export default async ({ id, slug }) => {
  const params = {
    Key: { pk: slug, sk: `content#${id}` }
  };

  try {
    await DDB('delete', params);
    return successDEL();
  } catch (e) {
    return failure(500, e);
  }
};
