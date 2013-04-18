var dwolla = require('../lib/dwolla');
var should = require('should');
var c = require('../config');

describe('Pending', function() {
  describe('Pending Transactions', function() {
    it('should respond with an array', function(done) {
      dwolla.pending(c.token, function(err, pending) {
        if (err) { return done(err); }
        done();
      });
    });
  });
});
