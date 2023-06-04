const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const NotificationPostLike = require('./NotificationPostLike');

const PostLike = sequelize.define('posts_likes', {
    post_like_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

NotificationPostLike.belongsTo(PostLike, {
    foreignKey: 'post_like_id',
    onDelete: 'cascade'
});
PostLike.hasOne(NotificationPostLike, {
    foreignKey: 'post_like_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = PostLike;