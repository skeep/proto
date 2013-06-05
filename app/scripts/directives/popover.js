/**
 *
 */
angular.module('protoApp').directive('popover', function () {
    'use strict';
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            $(element).popover();
        }
    };
});
