angular.module('services').factory('UserModel', function($http) {
    return {
        login: function(param,callback) {
            $http.post('/login',param).success(function(res) {
                callback(res);
            }).error(function(e) {
                callback(e);
            });
        }
    };
});