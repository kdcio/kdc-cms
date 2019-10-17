import DDB from '../../../lib/dynamodb';
import { success, failure } from '../../../lib/response';
import remap from '../../../lib/remap';
import fieldMap from './map';

export default async ({ id, slug }, opts = {}) => {
  const params = {
    Key: { pk: slug, sk: `content#${id}` }
  };
  const { raw } = opts;

  try {
    const data = await DDB('get', params);
    if (raw) return data.Item;
    if (!data.Item) {
      return failure(404, {
        code: 'ContentNotFound',
        message: 'Content not found'
      });
    }

    const { fields, sortKeyUsed, ...attr } = data.Item;
    const map = { ...fieldMap };
    map.gs1sk = sortKeyUsed;
    return success(remap(attr, fieldMap));
  } catch (e) {
    return failure(500, e);
  }
};
