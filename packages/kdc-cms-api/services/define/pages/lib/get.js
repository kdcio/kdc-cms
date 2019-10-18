import { DDB } from 'kdc-cms-dynamodb';
import { success, failure } from '../../../../lib/response';
import remap from '../../../../lib/remap';
import fieldMap from './map';

export default async ({ id }, opts = {}) => {
  const params = {
    Key: { pk: id, sk: 'page' }
  };
  const { raw } = opts;

  try {
    const data = await DDB('get', params);
    if (raw) return data.Item;
    if (!data.Item) {
      return failure(404, {
        error: 'PageDefinitionNotFound',
        message: 'Page definition not found'
      });
    }
    return success(remap(data.Item, fieldMap));
  } catch (e) {
    return failure(500, e);
  }
};
