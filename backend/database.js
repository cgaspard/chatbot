const { Sequelize } = require('sequelize');
const { DB_FILE } = process.env;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_FILE,
});

module.exports = sequelize;
