import { DDB } from 'kdc-cms-dynamodb';
import apigw from '../../lib/apigw';
import { handler } from './index';

const req = apigw(handler);
const homePage = {
  id: 'page-test',
  title: 'My Company',
  intro: 'Your wish is my command',
  summary: 'this should not be added' // should not be added
};

const homePageDef = {
  gs1pk: 'page',
  fieldCount: 2,
  createdAt: 1571285818578,
  sk: 'page',
  pk: 'page-test',
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    {
      name: 'intro',
      type: 'long-text'
    }
  ],
  gs1sk: 'Page Test'
};

describe('Pages', () => {
  beforeAll(async () => {
    await DDB('put', { Item: homePageDef });
  });

  afterAll(async () => {
    await DDB('delete', { Key: { pk: homePageDef.pk, sk: 'page' } });
  });

  it('should create', async () => {
    const { statusCode, body } = await req.post('/', homePage);
    expect(statusCode).toBe(201);
    expect(body.id).toBe(homePage.id);
  });

  it('should not create', async () => {
    const { statusCode, body } = await req.post('/', homePage);
    expect(statusCode).toBe(409);
    expect(body.error).toBe('PageExists');
  });

  it('should get', async () => {
    const { statusCode, body } = await req.get(`/${homePage.id}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.id).toEqual(homePage.id);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.gs1sk).toEqual(undefined);
    expect(body.title).toEqual(homePage.title);
    expect(body.intro).toEqual(homePage.intro);
    expect(body.summary).toEqual(undefined);
  });

  it('should list', async () => {
    const { statusCode, body } = await req.get(`/`);
    expect(statusCode).toBe(200);
    expect(body.length).toEqual(1);
  });

  it('it should update', async () => {
    const { statusCode, body } = await req.put(`/${homePage.id}`, {
      ...homePage,
      intro: "Yes I'm updated!"
    });
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });

  it('should update intro', async () => {
    const { statusCode, body } = await req.get(`/${homePage.id}`);
    expect(statusCode).toBe(200);
    expect(body.pk).toEqual(undefined);
    expect(body.id).toEqual(homePage.id);
    expect(body.sk).toEqual(undefined);
    expect(body.gs1pk).toEqual(undefined);
    expect(body.gs1sk).toEqual(undefined);
    expect(body.title).toEqual(homePage.title);
    expect(body.intro).toEqual("Yes I'm updated!");
    expect(body.summary).toEqual(undefined);
  });

  it('should delete', async () => {
    const { statusCode, body } = await req.delete(`/${homePage.id}`);
    expect(statusCode).toBe(204);
    expect(body).toBe(null);
  });
});
