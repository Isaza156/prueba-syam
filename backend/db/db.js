const mysql = require('mysql');
const mysqlConnection = mysql.createConnection({
  host: 'bjwpqwolidfbxiyvqjv9-mysql.services.clever-cloud.com',
  user: 'ufkab7bsvvm0t8yv',
  password: 'wDQYsAikFl13AelBlAgO',
  database: 'bjwpqwolidfbxiyvqjv9',
  multipleStatements: true
});
mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('Connected Database');
  }
});

module.exports = mysqlConnection;
