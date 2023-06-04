const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const NotificationCommentLike = require('./NotificationCommentLike');

const CommentLike = sequelize.define('comments_likes', {
    comment_like_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

NotificationCommentLike.belongsTo(CommentLike, {
    foreignKey: 'comment_like_id',
    onDelete: 'cascade'
});
CommentLike.hasOne(NotificationCommentLike, {
    foreignKey: 'comment_like_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = CommentLike;