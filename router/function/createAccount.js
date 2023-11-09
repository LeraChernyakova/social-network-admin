const fs = require("fs");
const path = require('path');

const allUsersStorage = require("../../storages/allUsers.json");
const authorizationStorage = require("../../storages/authorization.json");
const usersChatsStorage = require("../../storages/usersChats.json");
const usersFriendsStorage = require("../../storages/usersFriends.json");
const usersNewsStorage = require("../../storages/usersNews.json");

generateUserId = function() {
    return allUsersStorage[allUsersStorage.length - 1]._id + 1;
}

exports.createAccount = function(mail, password, FIO, birth) {
    const id = generateUserId();
    const user = {
        _id: id,
        img: "http://localhost:3000/img/delete.jpg",
        FIO: FIO,
        birth: birth,
        mail: mail,
        role: "Пользователь",
        status: "Неподтвержден"
    };

    allUsersStorage.push(user);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/allUsers.json'),
        JSON.stringify(allUsersStorage, null, 2)
    );

    const authorization = {
        _id: id,
        mail: mail,
        password: password
    }
    authorizationStorage.push(authorization);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/authorization.json'),
        JSON.stringify(authorizationStorage, null, 2)
    );

    const chats = {
        _id: id,
        secondUsers: []
    }
    usersChatsStorage.push(chats);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/usersChats.json'),
        JSON.stringify(usersChatsStorage, null, 2)
    );

    const friends = {
        _id : id,
        friendsID: []
    }
    usersFriendsStorage.push(friends);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/usersFriends.json'),
        JSON.stringify(usersFriendsStorage, null, 2)
    );

    const news = {
        _id: id,
        newsID: []
    }
    usersNewsStorage.push(news);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/usersNews.json'),
        JSON.stringify(usersNewsStorage, null, 2)
    );

    return user;
}