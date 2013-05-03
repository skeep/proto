'use strict';

describe('Directive: resizable', function () {
  beforeEach(module('protoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<resizable></resizable>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the resizable directive');
  }));
});
