require("dotenv").config();
module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": 'postgres',
    "timezone": process.env.TZ,
    "dialectOptions": {
      "ssl": {
        "require": true,
      }
    }
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": 'postgres',
    "timezone": process.env.TZ,
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": 'postgres',
    "timezone": process.env.TZ,
    "dialectOptions": {
      "ssl": {
        "require": true,
      }
    }
  }
};
