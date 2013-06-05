/**
 *
 */
angular.module('protoApp').directive('resizable', function () {
    'use strict';
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            $(element).resizable({
                stop: function (event, ui) {
                    scope.$parent.screens[attrs.screen].hotspots[attrs.id].width = ui.size.width;
                    scope.$parent.screens[attrs.screen].hotspots[attrs.id].height = ui.size.height;
                    console.log(scope.$parent.screens[attrs.screen].hotspots[attrs.id]);
                    scope.$parent.set(scope.$parent.screens);
                }
            });
        }
    };
});
