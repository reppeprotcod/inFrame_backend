const config = require('config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.db_name, process.env.user, process.env.password, {
        dialect: process.env.dialect,
        host: process.env.db_host
    }
);

module.exports = sequelize;