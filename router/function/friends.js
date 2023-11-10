const fs = require("fs");
const path = require("path");

const allUsersStorage = require("../../storages/allUsers.json");
const usersFriendsStorage = require("../../storages/usersFriends.json");

exports.getFriends = function(friends) {
    let userFriendsInfo = [];
    friends.forEach( id => {
        const index = allUsersStorage.findIndex(user => user._id === id);
        userFriendsInfo.push(allUsersStorage[index]);
    });
    return userFriendsInfo;
}

exports.getOtherUsers = function(id, friends) {
    let dontShow = [].concat(friends, id);
    let otherUsers = [];
    allUsersStorage.forEach( user => {
        if (dontShow.indexOf(user._id) === -1) {
            otherUsers.push(user);
        }
    });
    return otherUsers;
}

exports.addFriend = function(id, newFriend) {
    usersFriendsStorage.find(user => user._id === id).friendsID.push(newFriend);
    usersFriendsStorage.find(user => user._id === newFriend).friendsID.push(id);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/usersFriends.json'),
        JSON.stringify(usersFriendsStorage, null, 1)
    );
}

exports.deleteFriend = function(where, whom) {
    let temp = usersFriendsStorage.find(user => user._id === where).friendsID;
    temp.splice(temp.indexOf(whom), 1);
    temp = usersFriendsStorage.find(user => user._id === whom).friendsID;
    temp.splice(temp.indexOf(where), 1);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/usersFriends.json'),
        JSON.stringify(usersFriendsStorage, null, 1)
    );
}