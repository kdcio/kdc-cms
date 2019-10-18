import jwt from 'jsonwebtoken';
import { encrypt } from 'kdc-cms-utils';
import { success, failure } from '../../../lib/response';
import get from './get';

const failed = () =>
  failure(401, {
    error: 'LoginFailed',
    message: 'Username and/or password is incorrect'
  });

export default async ({ username, password }) => {
  const user = await get({ username }, { raw: true });
  if (!user) return failed();

  if (encrypt.isValidPassword(password, user.salt, user.hash)) {
    const token = jwt.sign({ sub: user.pk }, process.env.JWT_SECRET);
    return success({ username, token, name: user.gs1sk, role: user.role });
  }
  return failed();
};
