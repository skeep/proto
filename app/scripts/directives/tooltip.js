'use strict';

angular.module('protoApp')
  .directive('tooltip', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $(element).tooltip();
      }
    };
  });
