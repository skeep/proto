'use strict';

describe('Service: fs', function () {

  // load the service's module
  beforeEach(module('protoApp'));

  // instantiate service
  var fs;
  beforeEach(inject(function (_fs_) {
    fs = _fs_;
  }));

  it('should do something', function () {
    expect(!!fs).toBe(true);
  });

});
