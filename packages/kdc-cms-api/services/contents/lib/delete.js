import { DDB } from 'kdc-cms-dynamodb';
import { successDEL, failure } from '../../../lib/response';
import inc from '../../define/contents/lib/inc';

export default async ({ typeId, contentId }) => {
  const params = {
    Key: { pk: contentId, sk: `content#${typeId}` }
  };

  try {
    await DDB('delete', params);
    // decrement count in definition
    await inc({ id: typeId, inc: -1 });

    return successDEL();
  } catch (e) {
    return failure(500, e);
  }
};
