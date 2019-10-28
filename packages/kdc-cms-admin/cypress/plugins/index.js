process.env.DDB_TABLE = 'database-local.localhost';
process.env.IS_OFFLINE = true;

// eslint-disable-next-line import/no-extraneous-dependencies
const { DDB, clearByGSI } = require('kdc-cms-dynamodb');

module.exports = (on) => {
  on('task', {
    clearDb: (table) => clearByGSI(table),
    deleteUser: (username) => {
      const params = {
        Key: { pk: username, sk: 'user' },
      };
      return DDB('delete', params);
    },
  });
};
