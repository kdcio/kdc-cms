import { DDB } from 'kdc-cms-dynamodb';
import { successDEL, failure } from '../../../lib/response';
import inc from '../../define/contents/lib/inc';

export default async ({ id, slug }) => {
  const params = {
    Key: { pk: slug, sk: `content#${id}` }
  };

  try {
    await DDB('delete', params);
    // decrement count in definition
    await inc({ id, inc: -1 });

    return successDEL();
  } catch (e) {
    return failure(500, e);
  }
};
