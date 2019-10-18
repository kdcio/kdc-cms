import { clearByGSI } from 'kdc-cms-dynamodb';

export default async () => {
  await clearByGSI('page');
  await clearByGSI('page#data');
  await clearByGSI('content');
  await clearByGSI('content#data');
  await clearByGSI('user');
};
