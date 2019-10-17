import DDB from '../../../lib/dynamodb';
import { success, failure } from '../../../lib/response';
import remap from '../../../lib/remap';
import fieldMap from './map';

export default async ({ username }, opts = {}) => {
  const params = {
    Key: { pk: username, sk: 'user' }
  };
  const { raw } = opts;

  try {
    const data = await DDB('get', params);
    if (raw) return data.Item;
    if (!data.Item) {
      return failure(404, {
        code: 'UserNotFound',
        message: 'User not found'
      });
    }

    delete data.Item.hash;
    delete data.Item.salt;
    return success(remap(data.Item, fieldMap));
  } catch (e) {
    return failure(500, e);
  }
};
