import { DDB } from 'kdc-cms-dynamodb';
import { encrypt } from 'kdc-cms-utils';
import { ROLE_APP } from 'kdc-cms-roles';
import { successPOST, failure } from '../../../lib/response';
import get from './get';
import auth from './authenticate';
import update from './update';

/**
 * When changing this function, also change the file:
 * kdc-cms-setup/lib/create-user.js
 */
export default async ({ username, name, password, password2, ...attr }) => {
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
  const { hash, salt } = encrypt.password(password);
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

  const { role } = attr;
  if (role === ROLE_APP) {
    /**
     * Save app password so we can regenerate a new token later
     */
    Item.password = password;
    Item.gs1pk = 'user#app';
  }

  const params = { Item };

  try {
    await DDB('put', params);
    if (role === ROLE_APP) {
      // get token and save
      const token = await auth({ username, password }, { tokenOnly: true });
      await update({ username, attr: { token } });
    }
    return successPOST({ username });
  } catch (e) {
    return failure(500, e);
  }
};
