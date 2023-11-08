const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const NotificationCommentLike =  sequelize.define('notifications_comments_likes', {
    notif_com_like_id: {
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

module.exports = NotificationCommentLike;