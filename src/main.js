
var lib = require('./fibonacci');

var n = process.argv[2] ? Number(process.argv[2]) : 10;
process.argv[2]
console.log('fibonacci(' + n + ') is', lib.fibonacci(n));
