import { success } from '../../../lib/response';

export default async ({ requestContext: { authorizer } }) => {
  const { username, role, name } = authorizer;

  return success({ user: { username, role, name } });
};
