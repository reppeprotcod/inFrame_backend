const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const NotificationComment =  sequelize.define('notifications_comments', {
    notif_com_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    }
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = NotificationComment;