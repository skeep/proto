'use strict';

describe('Directive: draggable', function () {
  beforeEach(module('protoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<draggable></draggable>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the draggable directive');
  }));
});
