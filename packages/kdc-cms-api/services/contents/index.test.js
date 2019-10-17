import apigw from '../../lib/apigw';
import { handler } from './index';
import DDB from '../../lib/dynamodb';

const req = apigw(handler);
const news = {
  Date: new Date().toJSON().slice(0, 10),
  Name: 'My First News',
  Body: 'Aute consequat aute aliquip proident sint.',
  Slug: 'my-first-news'
};

const newsDef = {
  gs1pk: 'content',
  fieldCount: 4,
  createdAt: 1571300820637,
  sortKey: 'Date',
  sk: 'content',
  pk: 'news',
  fields: [
    {
      name: 'Name',
      type: 'text'
    },
    {
      name: 'Slug',
      type: 'text'
    },
    {
      name: 'Date',
      type: 'text'
    },
    {
      name: 'Body',
      type: 'long-text'
    }
  ],
  gs1sk: 'News',
  updatedAt: 1571300820691
};

describe('Contents', () => {
  beforeAll(async () => {
    await DDB('put', { Item: newsDef });
  });

  afterAll(async () => {
    await DDB('delete', { Key: { pk: newsDef.pk, sk: 'content' } });
  });

  it('should create', async () => {
    const { statusCode, body } = await req.post(`/${newsDef.pk}`, news);
    expect(statusCode).toBe(201);
    expect(body.id).toBe(news.Slug);
  });

  it('should not create', async () => {
    const { statusCode, body } = await req.post(`/${newsDef.pk}`, news);
    expect(statusCode).toBe(409);
    expect(body.code).toBe('ContentExists');
  });

  it('should get', async () => {
    const { statusCode, body } = await req.get(`/${newsDef.pk}/${news.Slug}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.gs1sk).toEqual(undefined);
    expect(body.Name).toEqual(news.Name);
    expect(body.Slug).toEqual(news.Slug);
    expect(body.Date).toEqual(news.Date);
    expect(body.Body).toEqual(news.Body);
    expect(body.createdAt).toBeGreaterThan(0);
    news.createdAt = body.createdAt;
  });

  it('should list', async () => {
    const { statusCode, body } = await req.get(`/${newsDef.pk}`);
    expect(statusCode).toBe(200);
    expect(body.length).toEqual(1);
    expect(body[0].Name).toEqual(news.Name);
    expect(body[0].Slug).toEqual(news.Slug);
    expect(body[0].Date).toEqual(news.Date);
    expect(body[0].Body).toEqual(undefined);
    expect(body[0].createdAt).toEqual(news.createdAt);
  });

  it('it should update', async () => {
    const { statusCode, body } = await req.put(`/${newsDef.pk}/${news.Slug}`, {
      title: 'My Updated Post',
      Body: 'Updated body'
    });
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });

  it('should update intro', async () => {
    const { statusCode, body } = await req.get(`/${newsDef.pk}/${news.Slug}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.gs1sk).toEqual(undefined);
    expect(body.Name).toEqual(news.Name);
    expect(body.Slug).toEqual(news.Slug);
    expect(body.Date).toEqual(news.Date);
    expect(body.Body).toEqual('Updated body');
    expect(body.createdAt).toEqual(news.createdAt);
    expect(body.updatedAt).toBeGreaterThan(0);
  });

  it('should delete', async () => {
    const { statusCode, body } = await req.delete(`/${newsDef.pk}/${news.Slug}`);
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });
});
