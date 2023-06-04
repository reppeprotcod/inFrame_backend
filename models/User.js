const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Post = require('./Post');
const Repost = require('./Repost');
const Comment = require('./Comment');
const Subscription = require('./Subscription');
const PostLike = require('./PostLike');
const CommentLike = require('./CommentLike');

const User = sequelize.define('users', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_photo: {
        type: DataTypes.STRING
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Repost.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});
User.hasMany(Repost, {
    foreignKey: 'user_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Subscription.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});
User.hasMany(Subscription, {
    foreignKey: 'user_id'
});

Subscription.belongsTo(User, {
    foreignKey: 'subscriber_id',
    onDelete: 'cascade'
});
User.hasMany(Subscription, {
    foreignKey: 'subscriber_id'
});

PostLike.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});
User.hasMany(PostLike, {
    foreignKey: 'user_id'
});

CommentLike.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});
User.hasMany(CommentLike, {
    foreignKey: 'user_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = User;