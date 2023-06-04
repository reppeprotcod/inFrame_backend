const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const NotificationSubscription =  sequelize.define('notifications_subscriptions', {
    notif_subscr_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    },
    is_allowed: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    }
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = NotificationSubscription;