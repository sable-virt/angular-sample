/**
 * app.js
 */
(function(angular) {
    var MODULES = [
        'ngSanitize',
        'ngAnimate'
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
    angular.module('app',MODULES.concat(MODULE_GROUP)).config(function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHTTPRequest';
    });
})(angular);