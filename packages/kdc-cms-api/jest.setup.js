import { createTable, clearByGSI } from 'kdc-cms-dynamodb';
import schema from '../../resources/database/schema.json';

export default async () => {
  await createTable(schema);
  await clearByGSI('page');
  await clearByGSI('page#data');
  await clearByGSI('content');
  await clearByGSI('content#data');
  await clearByGSI('user');
};
