const Post = require("./models/Post");
const Repost = require("./models/Repost");
const NotificationRepost = require('./models/NotificationRepost');

class RepostController {
    async addRepost(req, res) {
        try {
            const findRepost = await Repost.findOne({ where: { post_id: req.params.postId, user_id: req.user.id } });
            const date = new Date().toUTCString();
            if (!findRepost) {
                const repost = Repost.build({ date, post_id: req.params.postId, user_id: req.user.id });
                await repost.save();
                const notif = NotificationRepost.build({is_read: false, repost_id: repost.repost_id});
                await notif.save();
                res.json({ repost });
            }
            else {
                res.status(400).json({ message: "only one repost" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "addRepost error" });
        }
    }

    async getReposts(req, res) {
        try {
            const offset = req.query.offset || 0;
            const limit = req.query.limit || 10;
            // let reposts = await Repost.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.user.id}});
            // if(req.params.userId) {
            const reposts = await Repost.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.params.userId}});
            // }
            res.json({reposts});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "getReposts error" });
        }
    }

    async deleteRepost(req, res) {
        try {
            const repost = await Repost.findOne({ where: { repost_id: req.params.repostId, user_id: req.user.id } });
            if (repost) {
                await Repost.destroy({ where: { repost_id: repost.repost_id } });
                res.status(200).json({ message: "репост удалён" });
            }
            else {
                res.status(400).json({ message: "no repost" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "deleteRepost error" });
        }
    }
}

module.exports = new RepostController();