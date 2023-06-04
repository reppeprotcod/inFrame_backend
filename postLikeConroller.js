const Post = require("./models/Post");
const PostLike = require("./models/PostLike");
const NotificationPostLike = require('./models/NotificationPostLike');

class PostLikeController{
    async likeExisting(req, res) {
        try {
            const existingLike = await PostLike.findOne({where: {post_id: req.params.postId, user_id: req.user.id}});
            if(existingLike) {
                return res.json({isLikeExisting: true});
            }
            res.json({isLikeExisting: false});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "likeExisting error"});
        }
    }

    async addLike(req, res) {
        try {
            const existingLike = await PostLike.findOne({where: {post_id: req.params.postId, user_id: req.user.id}});
            if(!existingLike) {
                const like = PostLike.build({post_id: req.params.postId, user_id: req.user.id});
                await like.save();
                const notif = NotificationPostLike.build({is_read: false, post_like_id: like.post_like_id});
                await notif.save();
                res.json({like});
            }
            else {
                res.status(400).json({message: "только один лайк"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "addLike error"});
        }
    }

    // async getLikes(req, res) {
    //     try {
    //         const offset = req.query.offset;
    //         const limit = req.query.limit;
    //         const likes = await PostLike.findAll({limit:Number(limit), offset:Number(offset), where: {post_id: req.params.postId}});
    //         res.json({likes});
    //     } catch (e) {
    //         console.log(e);
    //         res.status(400).json({message: "getLikes error"});
    //     }
    // }

    async deleteLike(req, res) {
        try {
            const like = await PostLike.findOne({where: {post_id: req.params.postId, user_id: req.user.id}});
            if(like) {
                await PostLike.destroy({where: {post_like_id: like.post_like_id}});
                res.status(200).json({message: "лайк удалён"});
            }
            else {
                res.status(400).json({message: "нет прав"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "deleteLike error"});
        }
    }
}

module.exports = new PostLikeController();