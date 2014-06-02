angular.module('controllers').controller('RootCtrl',function($scope,$http,SocketService) {
    $scope.messages = [];
    SocketService.on('receive', function(message) {
        $scope.messages.unshift(message);
    });
    $scope.send = function() {
        SocketService.emit('send',$scope.inputMessage);
        $scope.inputMessage = '';
    };
});