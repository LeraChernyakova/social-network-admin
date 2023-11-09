const express = require("express");
const bodyParser = require("body-parser");
const allUsersStorage = require("../storages/allUsers.json");
const usersFriendsStorage = require("../storages/usersFriends.json");
const {getAllUsers, getUser, updateUserInfo} = require("./function/user");
const {getFriendsNews} = require("./function/news");
const {getUserChats, getAllChats} = require("./function/chats");
const {getFriends, getFriendsAdmin} = require("./function/friends");
const {getIo} = require("../socket");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

router.get('/',(req, res) => {
    res.render('startPage');
});

router.get('/admin',(req, res) => {
    res.render('usersPage', {users: getAllUsers()});
});

router.get('/admin/user/:id',(req, res) => {
   res.json(getUser(parseInt(req.params.id)));
});

router.post('/admin/user/update', (req, res) => {
    updateUserInfo(req);
    getIo().emit('infoUpdate');
    res.json({ success: true, message: 'Данные пользователя обновлены успешно.' });
});

router.get('/admin/friends/:id',(req, res) => {
    const id = parseInt(req.params.id);
    const user = allUsersStorage.find(user => user._id === id);
    const friends = usersFriendsStorage.find(user => user._id === id).friendsID
    res.render('usersFriends',{users: getFriends(friends), user: user});
});

router.get('/admin/news/:id',(req, res) => {
    const id = parseInt(req.params.id);
    const user = allUsersStorage.find(user => user._id === id);
    const friends = usersFriendsStorage.find(user => user._id === id).friendsID
    res.render('usersNews', {allNews: getFriendsNews(friends), user: user});
});


router.get('/admin/chats/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = allUsersStorage.find(user => user._id === id);
        const chats = getAllChats(id);
        res.render('usersChats', {userChats: chats, user: user});
    }
    catch(error) {
        console.error(error);
    }
});

module.exports = router;