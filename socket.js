const { Server } = require("socket.io");

let io;

exports.initIo = function (httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'DELETE'],
            credentials: true
        },
    });

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('Пользователь отключился...');
        });
    });
}

exports.getIo = function () {
    return io;
}