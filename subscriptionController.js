const sequelize = require("sequelize");
const Subscription = require("./models/Subscription");
const User = require("./models/User");
const UserSettings = require("./models/UserSettings");
const NotificationSubscription = require('./models/NotificationSubscription');

class SubscriptionController {
    async addSubscription(req, res) {
        try {
            if (req.params.userId == req.user.id) {
                res.status(400).json({ message: "you can not subscribe to yourself" });
            }

            const user = await User.findByPk(req.params.userId);
            const userSettings = await UserSettings.findOne({where: {user_set_id: user.user_set_id}});
            const privateProfile = userSettings.private_profile;
            let subscrStatus = true;
            let isAllowed = true;
            if(privateProfile){
                subscrStatus = false;
                isAllowed = false;
                //const notif = NotificationSubscription.build({is_read: false, is_allowed: false});
                //await notif.save();
            }

            const findSubscription = await Subscription.findOne({where: {user_id: req.params.userId, subscriber_id: req.user.id}});
            if(!findSubscription) {
                const subscription = Subscription.build({subscription_status: subscrStatus, user_id: req.params.userId, subscriber_id: req.user.id});
                await subscription.save();
                const notif = NotificationSubscription.build({is_read: false, is_allowed: isAllowed, subscription_id: subscription.subscription_id});
                await notif.save();
                res.json({subscription});
            }
            else {
                res.status(400).json({ message: "you have already subscribed" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "addSubscription error" });
        }
    }

    async deleteSubscription(req, res) {
        try {
            const subscription = await Subscription.findOne({where: {subscription_id: req.params.id}});
            if(subscription) {
                await Subscription.destroy({where: {subscription_id: req.params.id}});
                res.status(200).json({ message: "subscription deleted" });
            }
            else {
                res.status(400).json({message: "no subscription"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "deleteSubscription error" });
        }
    }

    async getSubscribers(req, res) {
        try {
            const offset = req.query.offset || 0;
            const limit = req.query.limit || 10;
            // let subscribers = await Subscription.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.user.id}});
            // if(req.params.userId) {
            const subscribers = await Subscription.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.params.userId, subscription_status: true}});
            // }
            res.json({subscribers});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "getSubscribers error" });
        }
    }

    async getSubscriptions(req, res) {
        try {
            const offset = req.query.offset || 0;
            const limit = req.query.limit || 10;
            // let subscribtions = await Subscription.findAll({limit:Number(limit), offset:Number(offset), where: {subscriber_id: req.user.id}});
            // if(req.params.userId){
            const subscriptions = await Subscription.findAll({limit:Number(limit), offset:Number(offset), where: {subscriber_id: req.params.userId, subscription_status: true}});
            // }
            
            res.json({subscriptions});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "getSubscribtions error" });
        }
    }

    async getSubscription(req, res) {
        try {
            const subscription = await Subscription.findOne({where: {user_id: req.params.userId, subscriber_id: req.user.id}});
            if(subscription) res.json({subscription});
            else res.json({subscription: false});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "getSubscribtions error" });
        }
    }

    async acceptSubscription(req, res) {
        try {
            const subscription = await Subscription.findOne({where: {subscription_id: req.params.id }});
            const subscrStatus = 1;
            if(subscription) {
                subscription.subscription_status = subscrStatus;
                await subscription.save();
                const notif = await NotificationSubscription.findOne({where: {subscription_id: subscription.subscription_id}});
                notif.is_allowed = true;
                await notif.save();
                res.status(200).json({message: "subscription accepted"});
            }
            else {
                res.status(400).json({ message: "no such subscription" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "acceptSubscription error" });
        }
    }

    async findUser (req, res) {
        try {
            const {username} = req.body;
            const users = await User.findAll({
                where: {
                    username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), 'LIKE', `%${username.toLowerCase()}%`)
                },
            });
            res.json({users});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "findUser error" });
        }
    }
}

module.exports = new SubscriptionController();