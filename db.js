const config = require('config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    config.get('db_name'), config.get('user'), config.get('password'), {
        dialect: config.get('dialect'),
        host: config.get('db_host')
    }
);

module.exports = sequelize;