process.env.DDB_TABLE = 'kdc-cms-database-local';
process.env.IS_OFFLINE = true;

// eslint-disable-next-line import/no-extraneous-dependencies
const { clearByGSI } = require('kdc-cms-dynamodb');

module.exports = (on) => {
  on('task', {
    clearDb: (table) => clearByGSI(table),
  });
};
