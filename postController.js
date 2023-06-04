const fs = require('fs');
const { uuid } = require('uuidv4');
const Post = require("./models/Post");
const PostLike = require("./models/PostLike");
const Role = require('./models/Role');
const User = require('./models/User');

class PostController {
    async createPost(req, res) {
        try {
            const date = new Date().toUTCString();
            if(req.body.description == undefined) req.body.description = '';
            const {description} = req.body;
            const {photo} = req.files;

            const dir = './post_photos';
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            const photoSplit = photo.name.split('.');
            photo.name = `${uuid()}.${photoSplit[photoSplit.length - 1]}`;
            photo.mv('./post_photos/' + photo.name);

            const post = Post.build({date, photo: photo.name, description, user_id: req.user.id});
            await post.save();
            res.json({post, message: "пост опубликован"});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "createPost error"});
        }
    }

    async getAllPosts(req, res) {
        try {
            const offset = req.query.offset || 0;
            const limit = req.query.limit  || 10;
            let posts = await Post.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.user.id}, order: [['date', 'desc']]});
            if(req.params.userId) {
                posts = await Post.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.params.userId}, order: [['date', 'desc']]});
            }
            for (let i = 0; i < posts.length; i++) {
                const likes = await PostLike.findAll({where: {post_id: posts[i].post_id}});
                posts[i].setDataValue('likeCount', likes.length);
            }
            res.json({posts});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getAllPosts error"});
        }
    }

    async getPost(req, res){
        try {
            const post = await Post.findOne({
                include: {model: User},
                where: {post_id: req.params.id}
            });
            const likes = await PostLike.findAll({where: {post_id: post.post_id}});
            post.setDataValue('likeCount', likes.length);
            res.json({post});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getPost error"});
        }
    }

    async deletePost(req, res) {
        try {
            const post = await Post.findByPk(req.params.id);
            const user = await User.findOne({where: {user_id: req.user.id}});
            const userRole = await Role.findOne({where: {role_id: user.role_id}});
            if(post.user_id === req.user.id || userRole.role_title === "admin") {
                if (fs.existsSync(`./post_photos/${post.photo}`)){
                    fs.unlinkSync(`./post_photos/${post.photo}`);
                }
                await Post.destroy({where: {post_id: req.params.id}});
                res.status(200).json({message: "Пост удалён"});
            }
            else {
                res.status(400).json({message: "нет прав"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "deletePost error"});
        }
    }

}

module.exports = new PostController();