var dwolla = require('../lib/dwolla');
var should = require('should');
var c = require('../config');

describe('Funding Sources', function() {
  describe('Listing', function() {
    it('should respond with an array', function(done) {
      dwolla.fundingSources(c.token, function(err, sources) {
        if (err) { return done(err); }
        done();
      });
    });
  });
  describe('Details by ID', function() {
    it('should return a transaction');
  });
});
