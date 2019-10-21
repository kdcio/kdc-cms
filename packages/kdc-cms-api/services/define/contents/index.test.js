import apigw from '../../../lib/apigw';
import { handler } from './index';

const req = apigw(handler);
const blogs = {
  name: 'Blogs',
  id: 'blogs',
  fieldCount: 3,
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    {
      name: 'date',
      type: 'text'
    },
    {
      name: 'body',
      type: 'long-text'
    }
  ],
  slug: 'text',
  sortKey: 'date'
};

describe('Content Definition', () => {
  it('should create', async () => {
    const { statusCode, body } = await req.post('/', blogs);
    expect(statusCode).toBe(201);
    expect(body.id).toBe(blogs.id);
  });

  it('should not create', async () => {
    const { statusCode, body } = await req.post('/', blogs);
    expect(statusCode).toBe(409);
    expect(body.error).toBe('ContentDefinitionExists');
  });

  it('should get', async () => {
    const { statusCode, body } = await req.get(`/${blogs.id}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.id).toEqual(blogs.id);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.name).toEqual(blogs.name);
    expect(body.fieldCount).toEqual(3);
    expect(body.fields[0].name).toEqual('title');
    expect(body.fields[0].type).toEqual('text');
    expect(body.fields[1].name).toEqual('date');
    expect(body.fields[1].type).toEqual('text');
    expect(body.fields[2].name).toEqual('body');
    expect(body.fields[2].type).toEqual('long-text');
  });

  it('should list', async () => {
    const { statusCode, body } = await req.get(`/`);
    expect(statusCode).toBe(200);
    expect(body[0].pk).toEqual(undefined);
    expect(body[0].id).toEqual(blogs.id);
    expect(body[0].sk).toEqual(undefined);
    expect(body[0].gs1pk).toEqual(undefined);
    expect(body[0].name).toEqual(blogs.name);
    expect(body[0].fieldCount).toEqual(3);
  });

  it('it should update', async () => {
    const { statusCode, body } = await req.put(`/${blogs.id}`, {
      ...blogs,
      name: 'New home page'
    });
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });

  it('should get', async () => {
    const { statusCode, body } = await req.get(`/${blogs.id}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.id).toEqual(blogs.id);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.name).toEqual('New home page');
    expect(body.fieldCount).toEqual(3);
    expect(body.fields[0].name).toEqual('title');
    expect(body.fields[0].type).toEqual('text');
    expect(body.fields[1].name).toEqual('date');
    expect(body.fields[1].type).toEqual('text');
    expect(body.fields[2].name).toEqual('body');
    expect(body.fields[2].type).toEqual('long-text');
  });

  it('should delete', async () => {
    const { statusCode, body } = await req.delete(`/${blogs.id}`);
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });
});
