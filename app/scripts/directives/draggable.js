/**
 *
 */
angular.module('protoApp').directive('draggable', function () {
    'use strict';
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            $(element).draggable({
                handle: 'span.handle',
                stop: function (event, ui) {
                    scope.$parent.screens[attrs.screen].hotspots[attrs.id].top = ui.position.top;
                    scope.$parent.screens[attrs.screen].hotspots[attrs.id].left = ui.position.left;
                    console.log(scope.$parent.screens[attrs.screen].hotspots[attrs.id]);
                    scope.$parent.set(scope.$parent.screens);
                }
            });
        }
    };
});
