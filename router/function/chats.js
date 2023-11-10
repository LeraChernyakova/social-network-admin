const fs = require("fs");
const path = require("path");
const _ = require('lodash');

const usersChatsStorage = require("../../storages/usersChats.json");
const messagesStorage = require("../../storages/messages.json");
const allUsersStorage = require("../../storages/allUsers.json");

generateMessageId = function() {
    return messagesStorage[messagesStorage.length - 1]._id + 1;
}

exports.getAllChats = function(currentUserId) {
    const userChatsId = usersChatsStorage.find(user => user._id === currentUserId)?.secondUsers || [];
    const msgData = messagesStorage;
    const chats = userChatsId.map(secondUserID => {
        const communication = msgData
            .filter(msg => (msg.userToID === secondUserID && msg.userFromID === currentUserId)
                || (msg.userToID === currentUserId && msg.userFromID === secondUserID))
            .map(msg => {
                const userTo = allUsersStorage.find(user => user._id === msg.userToID).FIO;
                const userFrom = allUsersStorage.find(user => user._id === msg.userFromID).FIO;
                return {
                    From: userFrom,
                    To: userTo,
                    ...msg
                };
            });
        return communication.length ? communication.sort(sortMessages) : [];
    });
    return chats.filter(chat => chat.length > 0);
};

exports.getUserChats = function(userId) {
    const tempChats = _.cloneDeep(usersChatsStorage);
    const chatsId = tempChats.find(user => user._id === userId).secondUsers;
    const chats = [];
    chatsId.forEach( id => {
        const communication = messagesStorage
            .filter(msg => (msg.userToID === userId && msg.userFromID === id)
                || (msg.userToID === id && msg.userFromID === userId))
        if (communication.length === 0) {
            let temp = usersChatsStorage.find(user => user._id === userId).secondUsers;
            temp.splice(temp.indexOf(id), 1);
            temp = usersChatsStorage.find(user => user._id === id).secondUsers;
            temp.splice(temp.indexOf(userId), 1);
        }
        else {
            const user = allUsersStorage.find(user => user._id === id);
            chats.push(user);
        }
    });
    fs.
    writeFileSync(
        path.join(__dirname, '../../storages/usersChats.json'),
        JSON.stringify(usersChatsStorage, null, 1)
    );
    return chats;
}

exports.getUserMessage = function(where, whom) {
    const communication = messagesStorage
        .filter(msg => (msg.userToID === where && msg.userFromID === whom)
            || (msg.userToID === whom && msg.userFromID === where))
        .map(msg => {
            const userFrom = allUsersStorage.find(user => user._id === msg.userFromID).FIO;
            return {
                From: userFrom,
                ...msg
            };
        });
    return communication.length ? communication.sort(sortMessages) : [];
};

exports.getOtherChats = function(id, chats) {
    let dontShow = [].concat(chats, id);
    let otherUsers = [];
    allUsersStorage.forEach( user => {
        if (dontShow.indexOf(user._id) === -1) {
            otherUsers.push(user);
        }
    });
    return otherUsers;
}

exports.addChat = function(id, newChat) {
    usersChatsStorage.find(user => user._id === id).secondUsers.push(newChat);
    usersChatsStorage.find(user => user._id === newChat).secondUsers.push(id)
    const communicationUser = allUsersStorage.find(user => user._id === newChat);
    const user = {
        id: communicationUser._id,
        FIO: communicationUser.FIO
    }
    fs.writeFileSync(
        path.join(__dirname, '../../storages/usersChats.json'),
        JSON.stringify(usersChatsStorage, null, 1)
    );
    return user;
}

exports.createMessage = function(where, whom, text) {
    const messageId = generateMessageId();

    const addLeadingZero = (value) => (value < 10 ? `0${value}` : value);

    const currentDate = new Date();
    const day = addLeadingZero(currentDate.getDate());
    const month = addLeadingZero(currentDate.getMonth() + 1);
    const year = currentDate.getFullYear();

    const hours = addLeadingZero(currentDate.getHours());
    const minutes = addLeadingZero(currentDate.getMinutes());
    const seconds = addLeadingZero(currentDate.getSeconds());

    const formattedDate = `${day}.${month}.${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const message = {
        _id: messageId,
        userFromID: where,
        userToID: whom,
        date: formattedDate,
        time: formattedTime,
        text: text
    }

    let temp = usersChatsStorage.find(user => user._id === where).secondUsers;
    if (temp.indexOf(whom) === -1)
        temp.push(whom);
    temp = usersChatsStorage.find(user => user._id === whom).secondUsers;
    if (temp.indexOf(where) === -1)
        temp.push(where);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/usersChats.json'),
        JSON.stringify(usersChatsStorage, null, 1)
    );


    messagesStorage.push(message);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/messages.json'),
        JSON.stringify(messagesStorage, null, 2)
    );
}

function toDate(data) {
    const string = data.split('.');
    let date = string[2];
    date += '-';
    date += string[1];
    date += '-';
    date += string[0];
    return date;
}

function sortMessages(first, second) {
    const dateComparison = toDate(first.date).localeCompare(toDate(second.date));
    if (dateComparison !== 0) {
        return dateComparison;
    }
    return first.time.localeCompare(second.time);
}