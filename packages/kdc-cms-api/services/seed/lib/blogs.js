import { DDB } from 'kdc-cms-dynamodb';
import blogDefinition from './assets/define-blog.json';
import blogData from './assets/blogs.json';

export default async () => {
  // create definition
  await DDB('put', { Item: blogDefinition });

  const promises = [];
  let ctr = 0;
  for (ctr = 0; ctr < blogData.blogs.length; ctr += 1) {
    const data = blogData.blogs[ctr];
    promises.push(DDB('put', { Item: data }));
  }

  return Promise.all(promises)
    .then(() => ctr)
    .catch(e => console.log(e));
};
