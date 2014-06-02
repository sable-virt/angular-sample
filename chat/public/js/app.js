/**
 * app.js
 */
(function(angular) {
    var MODULES = [
        'ngSanitize',
        'ngAnimate',
        'ngRoute',
        'ngStorage',
        'emoji'
    ];
    var MODULE_GROUP = [
        'controllers',
        'filters',
        'services',
        'directives'
    ];
    for (var i = 0, len = MODULE_GROUP.length; i < len; i++) {
        angular.module(MODULE_GROUP[i],[]);
    }
    angular.module('app',MODULES.concat(MODULE_GROUP)).config(function ($routeProvider,$locationProvider,$httpProvider) {
        $locationProvider.html5Mode(true);
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHTTPRequest';
        // ルーティング設定
        $routeProvider
            .when('/', {
                templateUrl: '/views/login',
                controller: 'LoginCtrl'
            })
            .when('/room/:id',{
                templateUrl: '/views/room',
                controller: 'RoomCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);