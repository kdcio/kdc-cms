import { DDB } from 'kdc-cms-dynamodb';
import pagesDefinition from './assets/define-pages.json';
import pageData from './assets/pages.json';

export default async () => {
  // create definition
  let promises = [];
  let ctr = 0;
  for (ctr = 0; ctr < pagesDefinition.pages.length; ctr += 1) {
    const data = pagesDefinition.pages[ctr];
    promises.push(DDB('put', { Item: data }));
  }

  promises = [];
  for (ctr = 0; ctr < pageData.pages.length; ctr += 1) {
    const data = pageData.pages[ctr];
    promises.push(DDB('put', { Item: data }));
  }

  return Promise.all(promises)
    .then(() => ctr)
    .catch(e => console.log(e));
};
