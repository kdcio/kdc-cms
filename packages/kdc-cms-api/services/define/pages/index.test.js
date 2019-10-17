import apigw from '../../../lib/apigw';
import { handler } from './index';

const req = apigw(handler);
const homePage = {
  name: 'Home Page',
  id: 'home',
  fieldCount: 2,
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    {
      name: 'intro',
      type: 'long-text'
    }
  ]
};

describe('Page Definition', () => {
  it('should create', async () => {
    const { statusCode, body } = await req.post('/', homePage);
    expect(statusCode).toBe(201);
    expect(body.id).toBe(homePage.id);
  });

  it('should not create', async () => {
    const { statusCode, body } = await req.post('/', homePage);
    expect(statusCode).toBe(409);
    expect(body.error).toBe('PageDefinitionExists');
  });

  it('should get', async () => {
    const { statusCode, body } = await req.get(`/${homePage.id}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.id).toEqual(homePage.id);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.name).toEqual(homePage.name);
    expect(body.fieldCount).toEqual(2);
    expect(body.fields[0].name).toEqual('title');
    expect(body.fields[0].type).toEqual('text');
    expect(body.fields[1].name).toEqual('intro');
    expect(body.fields[1].type).toEqual('long-text');
  });

  it('should list', async () => {
    const { statusCode, body } = await req.get(`/`);
    expect(statusCode).toBe(200);
    expect(body[0].pk).toEqual(undefined);
    expect(body[0].id).toEqual(homePage.id);
    expect(body[0].sk).toEqual(undefined);
    expect(body[0].gs1pk).toEqual(undefined);
    expect(body[0].name).toEqual(homePage.name);
    expect(body[0].fieldCount).toEqual(2);
  });

  it('it should update', async () => {
    const { statusCode, body } = await req.put(`/${homePage.id}`, { name: 'New home page' });
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });

  it('should get', async () => {
    const { statusCode, body } = await req.get(`/${homePage.id}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.id).toEqual(homePage.id);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.name).toEqual('New home page');
    expect(body.fieldCount).toEqual(2);
    expect(body.fields[0].name).toEqual('title');
    expect(body.fields[0].type).toEqual('text');
    expect(body.fields[1].name).toEqual('intro');
    expect(body.fields[1].type).toEqual('long-text');
  });

  it('should delete', async () => {
    const { statusCode, body } = await req.delete(`/${homePage.id}`);
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });
});
