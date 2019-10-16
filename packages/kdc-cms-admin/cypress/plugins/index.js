process.env.DDB_TABLE = 'kdc-cms-database-local';

const { clearDb } = require('kdc-cms-utils');

module.exports = (on) => {
  on('task', {
    clearDb: (table) => clearDb(table),
  });
};
