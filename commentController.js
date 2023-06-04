const Comment = require("./models/Comment");
const CommentLike = require("./models/CommentLike");
const Post = require("./models/Post");
const NotificationComment = require('./models/NotificationComment');
const User = require("./models/User");
const Role = require("./models/Role");

class CommentController {
    async getAllComments(req, res) {
        try {
            const offset = req.query.offset || 0;
            const limit = req.query.limit || 10;
            const comments = await Comment.findAll({limit:Number(limit), offset:Number(offset), where: {post_id: req.params.postId}, order: [['date', 'desc']]});
            for (let i = 0; i < comments.length; i++) {
                const likes = await CommentLike.findAll({where: {comment_id: comments[i].comment_id}});
                comments[i].setDataValue('likeCount', likes.length);
            }
            res.json({comments});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getAllComments error"});
        }
    }

    async addComment(req, res) {
        try {
            const date = new Date().toUTCString();
            const {text} = req.body;
            const comment = Comment.build({date, text, post_id: req.params.postId, user_id: req.user.id});
            await comment.save();
            const notif = NotificationComment.build({is_read: false, comment_id: comment.comment_id});
            await notif.save();
            res.json({comment});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "addComment error"});
        }
    }

    async deleteComment(req, res) {
        try {
            const comment = await Comment.findByPk(req.params.id);
            const post = await Post.findByPk(comment.post_id);
            const user = await User.findOne({where: {user_id: req.user.id}});
            const userRole = await Role.findOne({where: {role_id: user.role_id}});
            if(comment.user_id === req.user.id || post.user_id === req.user.id || userRole.role_title === "admin") {
                await Comment.destroy({where: {comment_id: req.params.id}});
                res.status(200).json({message: "comment deleted"});
            }
            else {
                res.status(400).json({message: "no rules"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "deleteComment error"});
        }
    }
}

module.exports = new CommentController();