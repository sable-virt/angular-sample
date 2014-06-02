var Socket = require('socket.io');
var RoomModel = require('../model/RoomModel');
var io;

exports.init = function(server) {
    io = Socket.listen(server, {log:false});

    io.sockets.on('connection', connected);
};

function connected(socket) {
    // 認証情報を確認する
    socket.on('enter', function (param) {
        RoomModel.get(param.room,function(err,room) {
            if(err || !room) {
                console.log('Error',err);
                socket.emit('error',{
                    message: 'Not found room'
                });
                return;
            }
            var members = RoomModel.checkIn(room._id,param.user);

            socket.set('client', {
                user: param.user,
                room: room
            },function() {
                socket.join(room._id);
                socket.emit('init',{
                    messages: room.messages.reverse(),
                    members: members
                });
                socket.broadcast.to(room._id).emit('enterMember',param.user);
            });
        });
    });

    socket.on('leave', leaveRoom);
    socket.on('disconnect', leaveRoom);

    socket.on('send', function(message) {
        socket.get('client', function(err,client) {
            if (err || !client) {
                console.log(err);
                return;
            }
            RoomModel.postMessage(client.room._id,{
                uid: client.user.uid,
                userName: client.user.userName,
                message: message
            },function(message) {
                io.sockets.in(client.room._id).emit('receive',message);
            });
        });
    });

    function leaveRoom() {
        socket.get('client', function(err,client) {
            if (err || !client) {
                console.log(err);
                return;
            }
            RoomModel.checkOut(client.room._id,client.user.uid);
            socket.leave(client.room._id);
            socket.broadcast.to(client.room._id).emit('leaveMember',client.user);
            socket.set('client','');
        });
    }
}

