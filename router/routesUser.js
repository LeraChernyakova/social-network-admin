const express = require("express");
const Sentry = require('@sentry/node');

const allUsersStorage = require("../storages/allUsers.json");
const usersNewsStorage = require("../storages/usersNews.json");
const usersFriendsStorage = require("../storages/usersFriends.json");
const usersChatsStorage = require("../storages/usersChats.json");

const {createAccount} = require("./function/createAccount");
const {createNews, getNews, getFriendsNews} = require("./function/news");
const {authorizationUser} = require("./function/authorizationUser");
const {getFriends, getOtherUsers, addFriend, deleteFriend} = require("./function/friends");
const {getUserChats, getUserMessage, getOtherChats, addChat, createMessage} = require("./function/chats");
const {changePhoto, deletePhoto} = require("./function/user");
const {getIo} = require("../socket");

const jwt = require('jsonwebtoken');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'public/img' });


router.post('/api/authorization/login', (req, res) => {
    const {mail, password} = req.body;
    try {
        const user = authorizationUser(mail, password);
        if (user === 'password'){
            res.status(401).json({
                success: false,
                message: `Введен неверный пароль.`});
        }
        else if (user) {
            const token = jwt.sign(
                {mail: user.mail},
                'my_secret_key',
                {expiresIn: '1h'}
            );
            res.status(200).json({success: true, token, user});
        }
        else {
            res.status(401).json({
                success: false,
                message: `Введены неверные учетные данные.`});
        }
    }
    catch (error) {
        console.error(error);
        Sentry.captureException(error);
        res.status(500).json({success: false, message: 'Ошибка при входе!'});
    }
});

router.post('/api/createAccount', (req, res) => {
    try {
        const {mail, password, FIO, birth} = req.body;
        if (allUsersStorage.some(user => user.mail === mail)) {
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким mail уже зарегистрирован.'
            })
        }
        const user = createAccount(mail, password, FIO, birth);
        const token = jwt.sign(
            {mail: user.mail},
            'my_secret_key',
            {expiresIn: '1h'}
        );
        res.status(200).json({
            success: true,
            message: 'Аккаунт успешно создан!',
            user,
            token
        });
    }
    catch (error) {
        console.error(error);
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка при создании аккаунта!'
        });
    }
})

router.get('/api/user/:id', (req, res) => {
    try {
        const user = allUsersStorage.find(user => user._id === parseInt(req.params.id));
        res.status(200).json(user);
    }
    catch (error) {
        Sentry.captureException(error);
        console.error(error);
    }
});

router.get('/api/user/news/:id', (req, res) => {
    try {
        const newsID = usersNewsStorage.find(user => user._id === parseInt(req.params.id)).newsID;
        const news = getNews(newsID);
        res.status(200).json(news);
    }
    catch (error) {
        Sentry.captureException(error);
        console.error(error);
    }
});

router.post('/api/changePhoto/:id', upload.single('photo'),(req, res) => {
    if (req.file) {
        changePhoto(parseInt(req.params.id), req.file.filename);
        getIo().emit('photo');
        res.status(200).json({
            success: true,
            message: 'Фотография была успешно обновлена.',
        });
    }
    else {
        const error = "Ошибка при обновлении фотографии!"
        console.error(error);
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: `Произошла ошибка при обновлении фотографии.`
        });
    }
})

router.delete('/api/deletePhoto/:id', (req, res) => {
    try {
        deletePhoto(parseInt(req.params.id));
        getIo().emit('photo');
        res.status(200).json({
            success: true,
            message: 'Фотография была успешно удалена.'
        });
    }
    catch (error) {
        console.error(error.message);
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: `Произошла ошибка при удалении фотографии.`
        });
    }
})

router.post('/api/add/news/:id', (req, res) => {
    const { news } = req.body;
    try {
        createNews(parseInt(req.params.id), news);
        getIo().emit('news');
        res.status(200).json({
            success: true,
            message: 'Новость была успешно опубликована.',
        });
    }
    catch(error) {
        console.error(error.message);
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: `Произошла ошибка при публикации новости.`
        });
    }
});

router.get('/api/user/friends/news/:id',(req, res) => {
    try {
        const friendsID = usersFriendsStorage.find(user => user._id === parseInt(req.params.id)).friendsID;
        const news = getFriendsNews(friendsID);
        res.status(200).json(news);
    }
    catch (error) {
        Sentry.captureException(error);
        console.error(error);
    }
});

router.get('/api/user/friends/:id',(req, res) => {
    try {
        const friendsID = usersFriendsStorage.find(user => user._id === parseInt(req.params.id)).friendsID;
        const friends = getFriends(friendsID);
        res.status(200).json(friends);
    }
    catch (error) {
        Sentry.captureException(error);
        console.error(error);
    }
});

router.get('/api/allUsers/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const friends = usersFriendsStorage.find(user => user._id === id).friendsID;
        const users = getOtherUsers(id, friends);
        res.status(200).json(users);
    }
    catch (error) {
        Sentry.captureException(error);
        console.error(error);
    }
});

router.post('/api/addFriend/:id', (req, res) => {
    try {
        const { newFriend } = req.body;
        addFriend(parseInt(req.params.id), parseInt(newFriend));
        getIo().emit('friend');
        res.status(200).json({
            success: true,
            message: 'Пользователь был добавлен в друзья.',
        });
    }
    catch(error) {
        console.error(error.message);
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: `Произошла ошибка при добавлении пользователя в друзья.`
        });
    }
})

router.delete('/api/deleteFriend/:where/:whom', (req, res) => {
    try {
        const where = parseInt(req.params.where);
        const whom = parseInt(req.params.whom);
        deleteFriend(where, whom);
        getIo().emit('friend');
        res.status(200).json({
            success: true,
            message: 'Пользователь был удален из друзей.',
        });
    }
    catch(error) {
        console.error(error.message);
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: `Произошла ошибка при удалении пользователя из друзей.`
        });
    }
})

router.get('/api/user/chats/:id',(req, res) => {
    try {
        const chats = getUserChats(parseInt(req.params.id));
        res.status(200).json(chats);
    }
    catch (error) {
        Sentry.captureException(error);
        console.error(error);
    }
})

router.get('/api/messages/:where/:whom',(req, res) => {
    try {
        const message = getUserMessage(parseInt(req.params.where), parseInt(req.params.whom));
        res.status(200).json(message);
    }
    catch (error) {
        Sentry.captureException(error);
        console.error(error);
    }
})

router.get('/api/chat/allUsers/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const chats = usersChatsStorage.find(user => user._id === id).secondUsers;
        const users = getOtherChats(id, chats);
        res.status(200).json(users);
    }
    catch (error) {
        Sentry.captureException(error);
        console.error(error);
    }
});

router.post('/api/addChat/:id', (req, res) => {
    try {
        const { newChat } = req.body;
        const addingChat = addChat(parseInt(req.params.id), parseInt(newChat));
        getIo().emit('chat');
        res.status(200).json({
            success: true,
            message: 'Пользователь был добавлен в друзья.',
            id: addingChat.id,
            FIO: addingChat.FIO
        });
    }
    catch(error) {
        console.error(error.message);
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: `Произошла ошибка при добавлении пользователя в друзья.`
        });
    }
})

router.post('/api/add/message/:where/:whom', (req, res) => {
    const { message } = req.body;
    try {
        createMessage(parseInt(req.params.where), parseInt(req.params.whom), message);
        getIo().emit('message');
        res.status(200).json({
            success: true,
            message: 'Сообщение успешно отправлено.',
        });
    }
    catch(error) {
        console.error(error.message);
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: `Произошла ошибка при отрпавки сообщения.`
        });
    }
});

module.exports = router;
