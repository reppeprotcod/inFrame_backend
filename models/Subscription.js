const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const NotificationSubscription = require('./NotificationSubscription');

const Subscription = sequelize.define('subscriptions', {
    subscription_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    subscription_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});

NotificationSubscription.belongsTo(Subscription, {
    foreignKey: 'subscription_id',
    onDelete: 'cascade'
});
Subscription.hasOne(NotificationSubscription, {
    foreignKey: 'subscription_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = Subscription;