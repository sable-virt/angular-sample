angular.module('controllers').controller('RootCtrl',function($scope,$location,$localStorage,IconBox) {
    $scope.user = {};

    $scope.$on('login',function(e,room) {
        $scope.room = room;
    });
    $scope.$on('unregister', function(e,param) {
        $scope.user.roomKey = param.id;
        $location.path('/');
    });
    $scope.icons = IconBox;
});