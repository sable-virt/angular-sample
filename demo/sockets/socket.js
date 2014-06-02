var Socket = require('socket.io');
var io;

exports.init = function(server) {
    io = Socket.listen(server, {log:false});
    io.sockets.on('connection', connected);
};

function connected(socket) {
    socket.on('send',function(message) {
        io.sockets.emit('receive',{
            message: message,
            date: new Date()
        });
    });
}

