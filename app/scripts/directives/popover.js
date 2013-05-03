'use strict';

angular.module('protoApp')
  .directive('popover', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $(element).popover();
      }
    };
  });
