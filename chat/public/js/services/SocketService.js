/**
 * Socket通信サービス
 */
angular.module("services").factory("SocketService",function($rootScope){
    if (typeof io === 'undefined') return;
    var socket = io.connect('http://'+location.host + '/',{
        'reconnect': true,
        'reconnection delay': 500,
        'max reconnection attempts': 10
    });
    return {
        on: function (type, listener) {
            socket.on(type, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    listener.apply(socket, args);
                });
            });
        },
        emit: function (type, data, listener) {
            socket.emit(type, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (listener) {
                        listener.apply(socket, args);
                    }
                });
            });
        },
        disconnect: function() {
            socket.disconnect();
        }
    };
});