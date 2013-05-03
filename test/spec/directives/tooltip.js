'use strict';

describe('Directive: tooltip', function () {
  beforeEach(module('protoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<tooltip></tooltip>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the tooltip directive');
  }));
});
