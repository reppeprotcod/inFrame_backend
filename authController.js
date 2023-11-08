const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('./models/User');
const Role = require('./models/Role');
const UserSettings = require('./models/UserSettings');
const { uuid } = require('uuidv4');
const { where } = require('sequelize');

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, config.get('secret'), {expiresIn: '24h'});
}

class AuthController {
    async checkUserName(req, res) {
        try{
            const {username} = req.body;
            const candidate = await User.findOne({where: {username: username}});
            if(candidate) {
                return res.json({availableName: false});
            }
            res.json({availableName: true});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "Ошибка проверки"});
        }
    }

    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                console.log(errors);
                return res.status(400).json({message: errors.errors[0].msg});
            }

            const {email, password, username, birth_date} = req.body;
            const user_id = uuid();
            let user_photo = req.files?.user_photo;
            if(!user_photo) {
                user_photo = {
                    name: "noPhotoUser.png"
                }
            }
            else {
                const parts = user_photo.name.split('.');
                user_photo.name = user_id + '.' + parts[parts.length - 1];
                user_photo.mv('./user_photos/' + user_photo.name);
            }

            const candidate = await User.findOne({where: {username: username}});
            if(candidate) {
                return res.status(400).json({message: "Имя занято"});
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const role = await Role.findOne({where: {role_title: "user"}});
            const userSettings = UserSettings.build({theme: 0, private_profile: 0});
            await userSettings.save();

            const user = User.build({user_id, email, password: hashPassword, username, user_photo: user_photo.name, birth_date, user_set_id: userSettings.user_set_id, role_id: role.role_id });
            await user.save();
            //res.status(200).json({message: 'Пользователь создан'});
            console.log('registration');
            res.json({message: "Пользователь создан!"});

        } catch (e) {
            console.log(e);
            res.status(400).json({message: "Ошибка регистрации"});
        }
    }

    async isAdmin(req, res) {
        try {
            const user = await User.findOne({where: {user_id: req.user.id}});
            const role = await Role.findOne({where: {role_id: user.role_id}});
            if(role.role_title === "admin") {
                res.json({admin: true});
            }
            else res.json({admin: false});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "isAdmin error"});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;

            const user = await User.findOne({where: {username: username}});
            if(!user){
                return res.status(400).json({message: "Неверный логин или пароль"});              
            }

            const comparePassword = bcrypt.compareSync(password, user.password);
            if(!comparePassword){
                return res.status(400).json({message: "Неверный логин или пароль"});
            }

            const token = generateAccessToken(user.user_id);
            res.json({token});

        } catch (e) {
            console.log(e);
            res.status(400).json({message: "Ошибка авторизации"});
        }
    }

    async getUser(req, res) {
        try {
            // let user = await User.findOne({where: {user_id: req.user.id}});
            // if(req.params.userId){
            const user = await User.findOne({where: {user_id: req.params.userId}});
            // }
            res.json({user});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "ошибка"});
        }
    }

    async changeUserPhoto(req, res){
        try {
            const {user_photo} = req.files;
            let user = await User.findOne({where: {user_id: req.user.id}});
            const parts = user_photo.name.split('.');
            user_photo.name = user.user_id + '.' + parts[parts.length - 1];
            user_photo.mv('./user_photos/' + user_photo.name);
            user.user_photo = user_photo.name;
            await user.save();
            res.json({user});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "ошибка изменения"});
        }
    }
    
    async getUserSettings(req, res) {
        try {
            const user = await User.findOne({where: {user_id: req.params.userId}});
            const userSettings = await UserSettings.findOne({where: {user_set_id: user.user_set_id}});
            res.json({userSettings});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getUserSettings error"});
        }
    }

    async userSettings(req, res) {
        try {
            const {theme, private_profile} = req.body;
            const user = await User.findOne({where: {user_id: req.user.id}});
            const userSettings = await UserSettings.findOne({where: {user_set_id: user.user_set_id}});
            userSettings.theme = theme;
            userSettings.private_profile = private_profile;
            await userSettings.save();
            res.json({userSettings});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "UserSettings error"});
        }
    }
}

module.exports = new AuthController();