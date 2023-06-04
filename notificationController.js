const NotificationComment = require('./models/NotificationComment');
const NotificationCommentLike = require('./models/NotificationCommentLike');
const NotificationPostLike = require('./models/NotificationPostLike');
const NotificationRepost = require('./models/NotificationRepost');
const NotificationSubscription = require('./models/NotificationSubscription');
const Comment = require('./models/Comment');
const Post = require('./models/Post');
const User = require('./models/User');
const CommentLike = require('./models/CommentLike');
const PostLike = require('./models/PostLike');
const Repost = require('./models/Repost');
const Subscription = require('./models/Subscription');
const { Op } = require('sequelize');

class NotificationController {
    async getCommentsNotifications (req, res) {
        try {
            const notifications = await NotificationComment.findAll({
                include: {
                    model: Comment,
                    where: {
                        user_id: {
                            [Op.not]: req.user.id
                        }
                    },
                    include: [
                        {
                            model: Post,
                            where: {
                                user_id: req.user.id
                            }
                        },
                        {
                            model: User
                        }
                    ]
                },
                where: {
                    is_read: false,
                }
            });
            const commentsNotifications = notifications.map((p) => {
                p.setDataValue('isComment', true);
                return p;
            }).filter((e) => e.comment);
            res.json({commentsNotifications});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getCommentsNotifications error"});
        }
    }

    async getCommentsLikesNotifications (req, res) {
        try {
            const notifications = await NotificationCommentLike.findAll({
                include: {
                    model: CommentLike,
                    where: {
                        user_id: {
                            [Op.not]: req.user.id
                        }
                    },
                    include: [
                        {
                            model: Comment,
                            where: {
                                user_id: req.user.id
                            },
                            include: {
                                model: Post
                            }
                        },
                        {
                            model: User
                        }
                    ],
                },
                where: {is_read: false}
            });
            const commentsLikesNotifications = notifications.map((p) => {
                p.setDataValue('isCommentLike', true);
                return p;
            }).filter((e) => e.comments_like?.comment);
            res.json({commentsLikesNotifications});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getCommentsLikesNotifications error"});
        }
    }

    async getPostsLikesNotifications (req, res) {
        try {
            const notifications = await NotificationPostLike.findAll({
                include: {
                    model: PostLike,
                    where: {
                        user_id: {
                            [Op.not]: req.user.id
                        }
                    },
                    include: [
                        {
                            model: Post,
                            where: {
                                user_id: req.user.id
                            }
                        },
                        {
                            model: User
                        }
                    ]
                },
                where: {is_read: false}
            });
            const postsLikesNotifications = notifications.map((p) => {
                p.setDataValue('isPostLike', true);
                return p;
            }).filter((e) => e.posts_like?.post);
            res.json({postsLikesNotifications});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getPostsLikesNotifications error"});
        }
    }

    async getRepostsNotifications (req, res) {
        try {
            const notifications = await NotificationRepost.findAll({
                include: {
                    model: Repost,
                    where: {
                        user_id: {
                            [Op.not]: req.user.id
                        }
                    },
                    include: [
                        {
                            model: Post,
                            where: {
                                user_id: req.user.id
                            }
                        },
                        {
                            model: User
                        }
                    ]
                },
                where: {is_read: false}
            });
            const repostsNotifications = notifications.map((p) => {
                p.setDataValue('isRepost', true);
                return p;
            }).filter((e) => e.repost);
            res.json({repostsNotifications});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getRepostsNotifications error"});
        }
    }

    async getSubscriptionsNotifications (req, res) {
        try {
            const notifications = await NotificationSubscription.findAll({
                include: {
                    model: Subscription,
                    where: {
                        user_id: req.user.id
                    },
                },
                where: {is_read: false}
            });
            const subscriptionsNotifications = notifications.map((p) => {
                p.setDataValue('isSubscription', true);
                return p;
            }).filter((e) => e.subscription);
            res.json({subscriptionsNotifications});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getSubscriptionsNotifications error"});
        }
    }

    async getNotificationRequest (req, res) {
        try {
            const notification = await NotificationSubscription.findOne({
                include: {
                    model: Subscription,
                    where: {
                        user_id: req.params.userId,
                        subscriber_id: req.user.id,
                        subscription_status: false
                    }
                }
            });
            console.log('notification: ', notification);
            if(notification) {
                res.json({status: true});
            }
            else res.json({status: false});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getNotificationRequest error"});
        }
    }

    async readCommentNotification (req, res) {
        try {
            const {notif_com_id} = req.body;
            let notif = await NotificationComment.findOne({where: {notif_com_id: notif_com_id}});
            notif.is_read = true;
            await notif.save();
            res.json({status: 'success'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "readCommentNotification error"});
        }
    }

    async readCommentLikeNotification (req, res) {
        try {
            const {notif_com_like_id} = req.body;
            let notif = await NotificationCommentLike.findOne({where: {notif_com_like_id: notif_com_like_id}});
            notif.is_read = true;
            await notif.save();
            res.json({status: 'success'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "readCommentLikeNotification error"});
        }
    }

    async readPostLikeNotification (req, res) {
        try {
            const {notif_like_id} = req.body;
            let notif = await NotificationPostLike.findOne({where: {notif_like_id: notif_like_id}});
            notif.is_read = true;
            await notif.save();
            res.json({status: 'success'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "readPostLikeNotification error"});
        }
    }

    async readRepostNotification (req, res) {
        try {
            const {notif_repost_id} = req.body;
            let notif = await NotificationRepost.findOne({where: {notif_repost_id: notif_repost_id}});
            notif.is_read = true;
            await notif.save();
            res.json({status: 'success'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "readRepostNotification error"});
        }
    }

    async readSubscriptionNotification (req, res) {
        try {
            const {notif_subscr_id} = req.body;
            let notif = await NotificationSubscription.findOne({where: {notif_subscr_id: notif_subscr_id}});
            notif.is_read = true;
            await notif.save();
            res.json({status: 'success'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "readSubscriptionNotification error"});
        }
    }

    async deleteReadNotifications (req, res) {
        try {
            await NotificationComment.destroy({where: {is_read: true}});
            await NotificationCommentLike.destroy({where: {is_read: true}});
            await NotificationPostLike.destroy({where: {is_read: true}});
            await NotificationRepost.destroy({where: {is_read: true}});
            await NotificationSubscription.destroy({where: {is_read: true}});
            res.json({status: 'success'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "deleteReadNotifications error"});
        }
    }
}

module.exports = new NotificationController();