const { Server } = require("socket.io");

let io;

exports.initIo = function (httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'DELETE'], // Методы, а не method
            credentials: true
        },
    });

    io.on('connection', (socket) => {
        // Обработчик события "disconnect"
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

exports.getIo = function () {
    return io;
}