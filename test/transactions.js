var dwolla = require('../lib/dwolla');
var should = require('should');
var c = require('../config');

describe('Transactions', function() {
  describe('Listing', function() {
    it('should respond with an array', function(done) {
      dwolla.transactions(c.token, function(err, trans) {
        if (err) { return done(err); }
        done();
      });
    });
  });
  describe('Details by ID', function() {
    it('should return a transaction');
  });
  describe('Stats', function() {
    it('should respond with an array', function(done) {
      dwolla.transactionsStats(c.token, function(err, trans) {
        if (err) { return done(err); }
        done();
      });
    });
  });
});
