

var lib = require('../src/fibonacci');
var should = require('should');

describe('test/fibonacci.js', function () {
  it('should equal 0 when n === 0', function () {
    lib.fibonacci(0).should.equal(0);
  });

  it('should equal 1 when n === 1', function () {
    lib.fibonacci(1).should.equal(1);
  });

  it('should equal 55 when n === 10', function () {
    lib.fibonacci(10).should.equal(55);
  });

  it('should throw when n < 0', function () {
    (function () {
      lib.fibonacci(-1);
    }).should.throw('n should >= 0');
  });

  it('should throw when n isnt Number', function () {
    (function () {
      lib.fibonacci('呵呵');
    }).should.throw('n should be a Number');
  });
});