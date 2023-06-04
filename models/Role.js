const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const User = require('./User');

const Role = sequelize.define('roles', {
    role_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role_title: {
        type: DataTypes.STRING
    }
});

User.belongsTo(Role, {
    foreignKey: 'role_id'
});
Role.hasOne(User, {
    foreignKey: 'role_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = Role;