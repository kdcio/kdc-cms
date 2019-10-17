import faker from 'faker';
import apigw from '../../lib/apigw';
import { handler } from './login';
import create from './lib/create';

const req = apigw(handler);
const user = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
  role: 'public'
};

describe('Login', () => {
  beforeAll(async () => {
    await create(user);
  });

  it('should login', async () => {
    const { statusCode, body } = await req.post('/', {
      username: user.username,
      password: user.password
    });
    expect(statusCode).toBe(200);
    expect(body.username).toBe(user.username);
    expect(body.name).toBe(user.name);
    expect(body.role).toBe(user.role);
    expect(body.token).not.toBeUndefined();
  });

  it('should not login', async () => {
    const { statusCode, body } = await req.post('/', {
      username: 'fake',
      password: 'fake'
    });
    expect(statusCode).toBe(401);
    expect(body.code).toBe('LoginFailed');
  });
});
