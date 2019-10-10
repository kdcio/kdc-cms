process.env.DYNAMODB_TABLE = 'kdc-cms';

const clearDb = require('../../../server/helpers/clearDb');

module.exports = (on) => {
  on('task', {
    clearDb: (table) => clearDb(table),
  });
};
