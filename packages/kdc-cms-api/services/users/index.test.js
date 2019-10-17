import faker from 'faker';
import apigw from '../../lib/apigw';
import { handler } from './index';

const req = apigw(handler);
const user = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
  role: 'public'
};

describe('Users', () => {
  it('should create', async () => {
    const { statusCode, body } = await req.post('/', user);
    expect(statusCode).toBe(201);
    expect(body.username).toBe(user.username);
  });

  it('should not create', async () => {
    const { statusCode, body } = await req.post('/', user);
    expect(statusCode).toBe(409);
    expect(body.code).toBe('UsernameExists');
  });

  it('should get', async () => {
    const { statusCode, body } = await req.get(`/${user.username}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.username).toEqual(user.username);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.gs1sk).toEqual(undefined);
    expect(body.email).toEqual(user.email);
    expect(body.name).toEqual(user.name);
    expect(body.role).toEqual(user.role);
    expect(body.password).toEqual(undefined);
    expect(body.hash).toEqual(undefined);
    expect(body.salt).toEqual(undefined);
  });

  it('should list', async () => {
    const { statusCode, body } = await req.get(`/`);
    expect(statusCode).toBe(200);
    expect(body.length).toEqual(1);
  });

  it('it should update', async () => {
    const { statusCode, body } = await req.put(`/${user.username}`, { role: 'admin' });
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });

  it('should update intro', async () => {
    const { statusCode, body } = await req.get(`/${user.username}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.username).toEqual(user.username);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.gs1sk).toEqual(undefined);
    expect(body.email).toEqual(user.email);
    expect(body.name).toEqual(user.name);
    expect(body.role).toEqual('admin');
    expect(body.password).toEqual(undefined);
    expect(body.hash).toEqual(undefined);
    expect(body.salt).toEqual(undefined);
  });

  it('should delete', async () => {
    const { statusCode, body } = await req.delete(`/${user.username}`);
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });
});
