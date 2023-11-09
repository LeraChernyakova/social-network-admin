const fs = require("fs");
const path = require("path");

const newsStorage = require("../../storages/news.json");
const allUsersStorage = require("../../storages/allUsers.json");
const usersNewsStorage = require("../../storages/usersNews.json");
const usersFriendsStorage = require("../../storages/usersFriends.json")

generateNewsId = function() {
    return newsStorage[newsStorage.length - 1]._id + 1;
}

exports.getNews = function(news) {
    let userNews = [];
    news.forEach( newsId => {
        const newsIndex = newsStorage.findIndex(news => news._id === newsId);
        const newsData = {
            ...newsStorage[newsIndex]
        };
        userNews.push(newsData);
    });
    userNews.sort(sortNews);
    return userNews;
}

exports.createNews = function(id, text) {
    const newsId = generateNewsId();

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
    const news = {
        _id: newsId,
        date: formattedDate,
        time: formattedTime,
        text: text
    }

    usersNewsStorage.find(user => user._id === id).newsID.push(newsId);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/usersNews.json'),
        JSON.stringify(usersNewsStorage, null, 2)
    );

    newsStorage.push(news);
    fs.writeFileSync(
        path.join(__dirname, '../../storages/news.json'),
        JSON.stringify(newsStorage, null, 2)
    );
}

exports.getFriendsNews = function(id) {
    let usersNews = [];
    id.forEach( userID => {
        const userIndex = allUsersStorage.findIndex(user => user._id === userID);
        const userFIO = allUsersStorage[userIndex].FIO;
        const newsID = usersNewsStorage.find(user => user._id === userID).newsID;
        newsID.forEach( newsID => {
            const newsIndex = newsStorage.findIndex(news => news._id === newsID);
            const newsData = {
                FIO: userFIO,
                ...newsStorage[newsIndex]
            };
            usersNews.push(newsData);
        })

    })
    usersNews.sort(sortNews);
    return usersNews;
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

function sortNews(first, second) {
    const dateComparison = toDate(second.date).localeCompare(toDate(first.date));
    if (dateComparison !== 0) {
        return dateComparison;
    }
    return second.time.localeCompare(first.time);
}