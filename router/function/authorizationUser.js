const authorizationStorage = require("../../storages/authorization.json");
const allUsersStorage = require("../../storages/allUsers.json");

exports.authorizationUser = function(mail, password) {
    const id = authorizationStorage.find(data => data.mail === mail);
    if (id) {
        const userId = authorizationStorage.find(data => data.mail === mail && data.password === password);
        if (userId) {
            return allUsersStorage.find(user => user._id === userId._id);
        }
        else
            return 'password'
    }
    else
        return null;
}