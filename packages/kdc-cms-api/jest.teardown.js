import clearDb from './lib/clearDb';

export default async () => {
  await clearDb('page');
  await clearDb('page#data');
};
