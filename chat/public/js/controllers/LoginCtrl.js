angular.module('controllers').controller('LoginCtrl',function($scope,$location,$localStorage,$filter,UserModel) {
    var filter = $filter('filter');
    $scope.histories = [];
    if ($localStorage.history) {
        $scope.histories = angular.fromJson($localStorage.history);
    }

    $scope.user.uid = $localStorage.uid || ($localStorage.uid = new Date().getTime() * Math.floor(Math.random()*100));
    $scope.user.userName = $localStorage.userName || '';
    $scope.user.type = 'enter';

    $scope.submit = function() {
        UserModel.login($scope.user,function(res) {
            if (res.status === false) {
                $scope.errorMessage = res.message;
                return;
            }
            $localStorage.userName = $scope.user.userName;
            var existRoom = filter($scope.histories,{
                roomKey: res.room.roomKey
            });
            $scope.$emit('login',res.room);
            if (existRoom.length === 1) {
                var index = $scope.histories.indexOf(existRoom[0]);
                $scope.histories.splice(index,1);
                $scope.histories.unshift(existRoom[0]);
            } else {
                $scope.histories.unshift(res.room);
            }
            $localStorage.history = angular.toJson($scope.histories);
            $localStorage.version = '0.0.0';
            $location.url('/room/' + res.room.roomKey);
        });
    };

    $scope.removeHistory = function(roomKey) {
        var existRoom = filter($scope.histories,{
            roomKey: roomKey
        });
        var l = existRoom.length;
        while(l--) {
            var index = $scope.histories.indexOf(existRoom[l]);
            $scope.histories.splice(l,1);
        }
        $localStorage.history = angular.toJson($scope.histories);
    }
});