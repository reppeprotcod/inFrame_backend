const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const User = require('./User');

const UserSettings = sequelize.define('user_settings', {
    user_set_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    theme: {
        type: DataTypes.INTEGER
    },
    private_profile: {
        type: DataTypes.BOOLEAN
    }
});

User.belongsTo(UserSettings, {
    foreignKey: 'user_set_id'
});
UserSettings.hasOne(User, {
    foreignKey: 'user_set_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = UserSettings;