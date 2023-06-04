const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const NotificationRepost = require('./NotificationRepost');

const Repost = sequelize.define('reposts', {
    repost_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

NotificationRepost.belongsTo(Repost, {
    foreignKey: 'repost_id',
    onDelete: 'cascade'
});
Repost.hasOne(NotificationRepost, {
    foreignKey: 'repost_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = Repost;