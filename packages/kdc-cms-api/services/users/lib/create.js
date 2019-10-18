import DDB from '../../../lib/dynamodb';
import { successPOST, failure } from '../../../lib/response';
import { encryptPassword } from '../../../lib/encrypt';
import get from './get';

/**
 * When changing this function, also change the file:
 * kdc-cms-setup/lib/create-user.js
 */
export default async ({ username, name, password, ...attr }) => {
  const current = await get({ username }, { raw: true });
  if (current) {
    if (current.statusCode) return current;
    return failure(409, {
      error: 'UsernameExists',
      message: 'Username already exists',
      username
    });
  }

  const createdAt = new Date().valueOf();
  const { hash, salt } = encryptPassword(password);
  const Item = {
    pk: username,
    sk: 'user',
    gs1pk: 'user',
    gs1sk: name,
    ...attr,
    hash,
    salt,
    createdAt
  };

  const params = { Item };

  try {
    await DDB('put', params);
    return successPOST({ username });
  } catch (e) {
    return failure(500, e);
  }
};
