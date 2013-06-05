/**
 *
 */
angular.module('protoApp').directive('tooltip', function () {
    'use strict';
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            $(element).tooltip();
        }
    };
});
