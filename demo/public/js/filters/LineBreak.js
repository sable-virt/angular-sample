/**
 * 改行コードをbrに変換するフィルタ
 */
angular.module('filters').filter('lineBreak', function () {
    return function (input, exp) {
        return input.replace(/\n|\r/g, "<br>");
    }
});
