const CommentLike = require("./models/CommentLike");
const NotificationCommentLike = require('./models/NotificationCommentLike');

class CommentLikeController {
    async addComLike(req, res) {
        try {
            const existingLike = await CommentLike.findOne({where: {comment_id: req.params.comId, user_id: req.user.id}});
            if(!existingLike) {
                const like = CommentLike.build({comment_id: req.params.comId, user_id: req.user.id});
                await like.save();
                const notif = NotificationCommentLike.build({is_read: false, comment_like_id: like.comment_like_id});
                await notif.save();
                res.json({like});
            }
            else {
                res.status(400).json({message: "only one like"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "addComLike error"});
        }
    }

    async comLikeExisting(req, res) {
        try {
            const existingLike = await CommentLike.findOne({where: {comment_id: req.params.comId, user_id: req.user.id}});
            if(existingLike) {
                return res.json({isLikeExisting: true});
            }
            res.json({isLikeExisting: false});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "comLikeExisting error"});
        }
    }

    async deleteComLike(req, res) {
        try {
            const like = await CommentLike.findOne({where: {comment_id: req.params.comId, user_id: req.user.id}});
            if(like) {
                await CommentLike.destroy({where: {comment_like_id: like.comment_like_id}});
                res.status(200).json({message: "like deleted"});
            }
            else {
                res.status(400).json({message: "no rules"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "deleteComLike error"});
        }
    }
}

module.exports = new CommentLikeController();