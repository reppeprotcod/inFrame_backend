const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const CommentLike = require('./CommentLike');
const NotificationComment = require('./NotificationComment');

const Comment = sequelize.define('comments', {
    comment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

CommentLike.belongsTo(Comment, {
    foreignKey: 'comment_id',
    onDelete: 'cascade'
});
Comment.hasMany(CommentLike, {
    foreignKey: 'comment_id'
});

NotificationComment.belongsTo(Comment, {
    foreignKey: 'comment_id'
});
Comment.hasOne(NotificationComment, {
    foreignKey: 'comment_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = Comment;