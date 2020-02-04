const pgPromise = require('pg-promise');
const pgp = pgPromise();
const dbOptions = {
  host: 'localhost',
  port: 5432,
  database: 'facenote',
  user: 'advardo',
  password: '1998'
}
const db = pgp(dbOptions);

module.exports = db;