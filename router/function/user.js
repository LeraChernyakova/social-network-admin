const allUsersStorage = require('../../storages/allUsers.json');
const {writeFileSync} = require("fs");
const {join} = require("path");
const fs = require("fs");
const path = require("path");


exports.getAllUsers = function() {
    return allUsersStorage;
};

exports.getUser = function(currentUserId) {
    return allUsersStorage.find(user => user._id === currentUserId);
};

exports.updateUserInfo = function(req) {
    const { userID, FIO, birth, mail, role, status } = req.body;
    const userIndex = allUsersStorage.findIndex(user => user._id === Number(userID));
    allUsersStorage[userIndex].FIO = FIO;
    allUsersStorage[userIndex].birth = birth;
    allUsersStorage[userIndex].mail = mail;
    allUsersStorage[userIndex].role = role;
    allUsersStorage[userIndex].status = status;
    writeFileSync(join(__dirname, '../../storages/allUsers.json'),
        JSON.stringify(allUsersStorage, null, 2));
};

exports.changePhoto = function(id, photo) {
    const index = allUsersStorage.findIndex(user => user._id === id);
    allUsersStorage[index].img = "http://localhost:3000/img/" + photo;
    fs.writeFileSync(
        path.join(__dirname, '../../storages/allUsers.json'),
        JSON.stringify(allUsersStorage, null, 2)
    );
}

exports.deletePhoto = function(id) {
    const index = allUsersStorage.findIndex(user => user._id === id);
    allUsersStorage[index].img = "http://localhost:3000/img/delete.jpg";
    fs.writeFileSync(
        path.join(__dirname, '../../storages/allUsers.json'),
        JSON.stringify(allUsersStorage, null, 2)
    );
}