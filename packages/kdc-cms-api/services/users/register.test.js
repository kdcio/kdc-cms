import faker from 'faker';
import apigw from '../../lib/apigw';
import { handler } from './register';
import authenticate from './lib/authenticate';

const req = apigw(handler);
const user = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password()
};

const user2 = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password()
};

const user3 = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password()
};

describe('Register', () => {
  it('should register public', async () => {
    const { statusCode, body } = await req.post('/public', user);
    expect(statusCode).toBe(201);
    expect(body.username).toBe(user.username);
  });

  it('should login public', async () => {
    const { statusCode, body } = await authenticate({
      username: user.username,
      password: user.password
    });
    const token = JSON.parse(body);
    expect(statusCode).toBe(200);
    expect(token.username).toBe(user.username);
    expect(token.name).toBe(user.name);
    expect(token.role).toBe('public');
    expect(token.token).not.toBeUndefined();
  });

  it('should register adviser', async () => {
    const { statusCode, body } = await req.post('/adviser', user2);
    expect(statusCode).toBe(201);
    expect(body.username).toBe(user2.username);
  });

  it('should login', async () => {
    const { statusCode, body } = await authenticate({
      username: user2.username,
      password: user2.password
    });
    const token = JSON.parse(body);
    expect(statusCode).toBe(200);
    expect(token.username).toBe(user2.username);
    expect(token.name).toBe(user2.name);
    expect(token.role).toBe('adviser');
    expect(token.token).not.toBeUndefined();
  });

  it('should not register admin', async () => {
    const { statusCode, body } = await req.post('/admin', user3);
    expect(statusCode).toBe(400);
    expect(body.error).toBe('InvalidRequest');
  });
});
