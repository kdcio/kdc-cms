import { DDB } from 'kdc-cms-dynamodb';
import apigw from '../../lib/apigw';
import { handler } from './index';

const req = apigw(handler);
const news = {
  date: new Date().toJSON().slice(0, 10),
  name: 'My First News',
  body: 'Aute consequat aute aliquip proident sint.',
  slug: 'my-first-news'
};

const newsNoSortKey = {
  name: 'My Error News',
  body: 'Aute consequat aute aliquip proident sint.',
  slug: 'my-error-news'
};

const newsDef = {
  gs1pk: 'content',
  fieldCount: 4,
  createdAt: 1571300820637,
  sortKey: 'date',
  sk: 'content',
  pk: 'news',
  nameKey: 'name',
  fields: [
    {
      label: 'Name',
      name: 'name',
      type: 'text'
    },
    {
      label: 'Slug',
      name: 'slug',
      type: 'text'
    },
    {
      label: 'Date',
      name: 'date',
      type: 'text'
    },
    {
      label: 'Body',
      name: 'body',
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
    expect(body.id).toBeDefined();
    news.id = body.id;
  });

  // TODO: make slug unique
  // it('should not create', async () => {
  //   const { statusCode, body } = await req.post(`/${newsDef.pk}`, news);
  //   expect(statusCode).toBe(409);
  //   expect(body.error).toBe('ContentExists');
  // });

  it('should not create without a sortkey', async () => {
    const { statusCode, body } = await req.post(`/${newsDef.pk}`, newsNoSortKey);
    expect(statusCode).toBe(400);
    expect(body.error).toBe('SortKeyInvalid');
  });

  it('should get', async () => {
    const { statusCode, body } = await req.get(`/${newsDef.pk}/${news.id}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.gs1sk).toEqual(undefined);
    expect(body.id).toBeDefined();
    expect(body.name).toEqual(news.name);
    expect(body.slug).toEqual(news.slug);
    expect(body.date).toEqual(news.date);
    expect(body.body).toEqual(news.body);
    expect(body.createdAt).toBeGreaterThan(0);
    news.createdAt = body.createdAt;
  });

  it('should list', async () => {
    const { statusCode, body } = await req.get(`/${newsDef.pk}`);
    expect(statusCode).toBe(200);
    expect(body.next).toBe(null);
    expect(body.list.length).toEqual(1);
    // TODO: make slug unique
    expect(body.list[0].name).toEqual(news.name);
    // expect(body.list[0].slug).toEqual(news.slug);
    expect(body.list[0].id).toBeDefined();
    expect(body.list[0].date).toEqual(news.date);
    expect(body.list[0].body).toEqual(undefined);
    expect(body.list[0].createdAt).toEqual(news.createdAt);
  });

  it('it should update', async () => {
    const { statusCode, body } = await req.put(`/${newsDef.pk}/${news.id}`, {
      ...news,
      title: 'My Updated Post',
      body: 'Updated body'
    });
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });

  it('it should Not update with out SortKey', async () => {
    const { statusCode, body } = await req.put(`/${newsDef.pk}/${news.id}`, {
      ...news,
      title: 'My Updated Post',
      body: 'Updated body',
      date: undefined
    });
    expect(statusCode).toBe(400);
    expect(body.error).toBe('SortKeyInvalid');
  });

  it('should update intro', async () => {
    const { statusCode, body } = await req.get(`/${newsDef.pk}/${news.id}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.gs1sk).toEqual(undefined);
    expect(body.id).toBeDefined();
    expect(body.name).toEqual(news.name);
    expect(body.slug).toEqual(news.slug);
    expect(body.date).toEqual(news.date);
    expect(body.body).toEqual('Updated body');
    expect(body.createdAt).toEqual(news.createdAt);
    expect(body.updatedAt).toBeGreaterThan(0);
  });

  it('should delete', async () => {
    const { statusCode, body } = await req.delete(`/${newsDef.pk}/${news.id}`);
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });
});
