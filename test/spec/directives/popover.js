'use strict';

describe('Directive: popover', function () {
  beforeEach(module('protoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<popover></popover>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the popover directive');
  }));
});
