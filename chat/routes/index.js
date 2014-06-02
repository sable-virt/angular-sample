/*
 * GET home page.
 */

var RoomModel = require('../model/RoomModel');

exports.index = function (req, res) {
    res.render('index');
};
exports.views = function (req, res) {
    res.render(req.params.name);
};

exports.login = function (req, res) {
    var uid = req.body.uid;
    var userName = req.body.userName;
    var roomName = req.body.roomName;
    var roomKey = req.body.roomKey;
    var password = req.body.password;
    var type = req.body.type;

    if (!userName || !type || !uid) {
        res.json({
            reqest: req.body,
            result: null,
            message: '不正なアクセスです',
            status: false
        });
        res.send(500);
    }
    if (type === 'create') {
        RoomModel.create({
            roomName: roomName,
            password: password
        },function(err,result) {
            enterRoom(res,err,result);
        });
    } else {
        RoomModel.enter({
            roomKey: roomKey,
            password: password
        },function(err,result) {
            enterRoom(res,err,result);
        });
    }
};

function enterRoom(res,err,room) {
    if(!room) {
        res.json({
            error: err,
            message: 'ルームキーまたはパスワードが間違っています。',
            status: false
        });
        return;
    }
    res.json({
        status: true,
        room: {
            roomName: room.roomName,
            roomKey: room.roomKey,
            token: room.password || '',
            updateDate: room.updateDate,
            createDate: room.createDate
        }
    });
}
