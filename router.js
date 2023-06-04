const {Router} = require('express');
const {check} = require('express-validator');
const AuthController = require('./authController');
const CommentController = require('./commentController');
const CommentLikeController = require('./commentLikeController');
const authMiddleware = require('./middleware/auth.middleware');
const PostController = require('./postController');
const PostLikeConroller = require('./postLikeConroller');
const RepostController = require('./repostController');
const SubscriptionController = require('./subscriptionController');
const NotificationController = require('./notificationController');

const router = new Router();

router.post('/registration', [
    check('email', "Введите email").isEmail(),
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "длина пароля не может быть меньше 6 или больше 50 символов").isLength({min: 6, max: 50}),
   
], AuthController.registration);
router.post('/checkUserName', AuthController.checkUserName);
router.post('/login', AuthController.login);
//router.get('/getUser', authMiddleware, AuthController.getUser);
router.get('/getUser/:userId', authMiddleware, AuthController.getUser);
router.get('/getUserSettings/:userId', authMiddleware, AuthController.getUserSettings);
router.get('/isAdmin', authMiddleware, AuthController.isAdmin);
router.put('/changeUserPhoto', authMiddleware, AuthController.changeUserPhoto);
router.put('/userSettings', authMiddleware, AuthController.userSettings);

router.post('/createPost', authMiddleware, PostController.createPost);
router.get('/getPosts', authMiddleware, PostController.getAllPosts);
router.get('/getPosts/:userId', authMiddleware, PostController.getAllPosts);
router.get('/getPost/:id', authMiddleware, PostController.getPost);
router.delete('/deletePost/:id', authMiddleware, PostController.deletePost);

router.get('/getAllComments/:postId', authMiddleware, CommentController.getAllComments);
router.post('/addComment/:postId', authMiddleware, CommentController.addComment);
router.delete('/deleteComment/:id', authMiddleware, CommentController.deleteComment);

router.post('/addLike/:postId', authMiddleware, PostLikeConroller.addLike);
router.post('/likeExisting/:postId', authMiddleware, PostLikeConroller.likeExisting);
//router.get('/getLikes/:postId', authMiddleware, PostLikeConroller.getLikes);
router.delete('/deleteLike/:postId', authMiddleware, PostLikeConroller.deleteLike);

router.post('/addComLike/:comId', authMiddleware, CommentLikeController.addComLike);
router.delete('/deleteComLike/:comId', authMiddleware, CommentLikeController.deleteComLike);
router.post('/comLikeExisting/:comId', authMiddleware, CommentLikeController.comLikeExisting);

router.post('/addRepost/:postId', authMiddleware, RepostController.addRepost);
router.delete('/deleteRepost/:repostId', authMiddleware, RepostController.deleteRepost);
router.get('/getReposts/:userId', authMiddleware, RepostController.getReposts);
//router.get('/getReposts', authMiddleware, RepostController.getReposts);

router.post('/addSubscription/:userId', authMiddleware, SubscriptionController.addSubscription);
router.delete('/deleteSubscription/:id', authMiddleware, SubscriptionController.deleteSubscription);
router.get('/acceptSubscription/:id', authMiddleware, SubscriptionController.acceptSubscription);
router.get('/getSubscriptions/:userId', authMiddleware, SubscriptionController.getSubscriptions);
//router.get('/getSubscriptions', authMiddleware, SubscriptionController.getSubscriptions);
router.get('/getSubscription/:userId', authMiddleware, SubscriptionController.getSubscription);
router.get('/getSubscribers/:userId', authMiddleware, SubscriptionController.getSubscribers);
//router.get('/getSubscribers', authMiddleware, SubscriptionController.getSubscribers);
router.post('/findUser', authMiddleware, SubscriptionController.findUser);

router.get('/getCommentsNotifications', authMiddleware, NotificationController.getCommentsNotifications);
router.get('/getCommentsLikesNotifications', authMiddleware, NotificationController.getCommentsLikesNotifications);
router.get('/getPostsLikesNotifications', authMiddleware, NotificationController.getPostsLikesNotifications);
router.get('/getRepostsNotifications', authMiddleware, NotificationController.getRepostsNotifications);
router.get('/getSubscriptionsNotifications', authMiddleware, NotificationController.getSubscriptionsNotifications);
router.get('/getNotificationRequest/:userId', authMiddleware, NotificationController.getNotificationRequest);
router.put('/readCommentNotification', authMiddleware, NotificationController.readCommentNotification);
router.put('/readCommentLikeNotification', authMiddleware, NotificationController.readCommentLikeNotification);
router.put('/readPostLikeNotification', authMiddleware, NotificationController.readPostLikeNotification);
router.put('/readRepostNotification', authMiddleware, NotificationController.readRepostNotification);
router.put('/readSubscriptionNotification', authMiddleware, NotificationController.readSubscriptionNotification);
router.delete('/deleteReadNotifications', authMiddleware, NotificationController.deleteReadNotifications);

module.exports = router;