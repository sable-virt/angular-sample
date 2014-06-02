/**
 * Shift+Enterでsubmitするディレクティブ
 */
angular.module("directives").directive("shiftSubmit",
    function() {
        return {
            restrict: 'AC',
            link : function($scope, $element, $attr){
                var $form = angular.element(document[$attr.shiftSubmit]);
                $element.on("keydown", function(e) {

                    if (e.shiftKey && e.keyCode === 13) {
                        e.preventDefault();
                        $form.triggerHandler('submit');
                    }
                });
            }
        };
    }
);