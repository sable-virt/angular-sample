angular.module('controllers').controller('RoomCtrl',function($scope,$routeParams,$timeout,SocketService) {
    if (!$scope.room) {
        $scope.$emit('unregister',$routeParams);
        return;
    } else {
        //SocketService.on('connect', connect);
        connect();
    }
    function connect() {
        SocketService.emit('enter',{
            user: {
                uid: $scope.user.uid,
                userName: $scope.user.userName
            },
            room: {
                roomKey: $scope.room.roomKey,
                token: $scope.room.token
            }
        });
    }

    SocketService.on('error',function(res) {
        //alert(res.message);
    });
    SocketService.on('init',function(res) {
        $scope.members = res.members;
        $scope.messages = res.messages;
    });
    SocketService.on('enterMember', function(member) {
        $scope.members.push(member);
        $scope.messages.unshift({
            userName: '',
            createDate: new Date(),
            message: ':heavy_plus_sign: ' + member.userName + 'さんが入室しました'
        });
    });
    SocketService.on('leaveMember', function(member) {
        var index = -1;
        for (var i = 0, len = $scope.members.length; i < len; i++) {
            if ($scope.members[i].uid === member.uid) {
                index = i;
                break;
            }
        }
        if (index === -1) return;
        $scope.members.splice(index,1);
        $scope.messages.unshift({
            userName: '',
            createDate: new Date(),
            message: ':heavy_minus_sign: ' + member.userName + 'さんが退室しました'
        });
    });
    SocketService.on('receive', function(message) {
        $scope.messages.unshift(message);
        for (var i = 0, len = $scope.members.length; i < len; i++) {
            if($scope.members[i].uid == message.uid) {
                var member = $scope.members.splice(i,1);
                member[0].latestMessage = message;
                $scope.members.unshift(member[0]);

                break;
            }
        }
    });

    $scope.post = '';
    $scope.query = {
        userName: '',
        word: ''
    };
    var cursorPosition = 0;
    var post = document.getElementById('post');

    $scope.toggleIcon = function() {
        $scope.iconMode = !$scope.iconMode;
        if ($scope.iconMode) {
            cursorPosition = document.selection ? document.selection.createRange() : post.selectionStart;
        } else {
            $timeout(function() {
                post.focus();
            });
        }
    };
    $scope.insert = function(str) {
        $scope.iconMode = false;
        $scope.post = $scope.post.substr(0, cursorPosition) + str + $scope.post.substr(cursorPosition);
        $timeout(function() {
            post.focus();
        });
    };
    $scope.filterUser = function(uid) {
        if ($scope.query.uid === uid) {
            $scope.query.uid = '';
        } else {
            $scope.query.uid = uid;
        }
    };
    $scope.send = function() {
        SocketService.emit('send', $scope.post);
        $scope.post = '';
    };
    $scope.$on('$destroy', function() {
        SocketService.emit('leave');
    });
});