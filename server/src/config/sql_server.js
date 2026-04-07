require("dotenv").config();
const dbConfig = {
  host: process.env.host,
  port: process.env.port || 3306,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
};

if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = { rejectUnauthorized: false };
}

module.exports = dbConfig;
