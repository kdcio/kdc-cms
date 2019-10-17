import clearDb from './lib/clearDb';

export default async () => {
  await clearDb('page');
  await clearDb('page#data');
  await clearDb('content');
  await clearDb('content#data');
  await clearDb('user');
};
