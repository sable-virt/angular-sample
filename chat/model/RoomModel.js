var crypto = require('crypto');
var mongoose = require('mongoose');

function createKey(size) {
    size = size || 8;
    return crypto.randomBytes(Math.ceil(size * 3 / 4)).toString('base64').slice(0, size);
}

var MessageSchema = new mongoose.Schema({
    uid: {type:String},
    userName: {type:String},
    message: {type:String},
    updateDate: {type:Date},
    createDate: {type:Date}
});

var RoomSchema = new mongoose.Schema({
    roomName: {type:String},
    password: {type:String},
    updateDate: {type:Date},
    createDate: {type:Date},
    roomKey: {type:String},
    messages: [MessageSchema]
});

var rooms = {};
var RoomModel = mongoose.model('RoomModel',RoomSchema);
var MessageModel = mongoose.model('MessageModel',MessageSchema);

exports.checkIn = function(id,user) {
    if (!rooms[id]) {
        rooms[id] = [user];
    } else {
        rooms[id].push(user);
    }
    return rooms[id];
};
exports.checkOut = function(id,uid) {
    if (rooms[id]) {
        for(var i = 0, len = rooms[id].length;i < len; i++) {
            if(rooms[id][i].uid == uid) {
                rooms[id].splice(i,1);
                break;
            }
        }
    }
};
function cryptoPass(pass) {
    if (!pass) return '';
    var shasum = crypto.createHash('sha512');
    shasum.update(pass);
    return shasum.digest('hex');
}

exports.create = function(param,callback) {
    param.password = cryptoPass(param.password);
    param.createDate = param.updateDate = new Date();
    param.roomKey = createKey();
    param.messages = [];
    RoomModel.create(param,callback);
};
exports.enter = function(param,callback) {
    RoomModel.findOne({
        roomKey: param.roomKey,
        password: cryptoPass(param.password)
    },'roomName roomKey updateDate createDate').exec(callback);
};

exports.get = function(param,callback) {
    RoomModel.findOne({
        roomKey: param.roomKey,
        password: param.token
    },callback);
};

exports.postMessage = function(id,param,callback) {
    RoomModel.findOne({
        _id: id
    },'messages',function(err, room){
        if (err) {
            callback(err);
        }
        var mes = new MessageModel({
            uid: param.uid,
            userName: param.userName,
            message: param.message,
            updateDate: new Date(),
            createDate: new Date()
        });
        room.messages.push(mes);
        room.save(function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(mes);
            callback(mes);
        });
    });
};
