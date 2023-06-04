const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const NotificationRepost =  sequelize.define('notifications_reposts', {
    notif_repost_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = NotificationRepost;