var dwolla = require('../lib/dwolla');
var should = require('should');
var c = require('../config');

describe('Balance', function() {
  describe('Account Balance', function() {
    it('should respond with a number', function(done) {
      dwolla.balance(c.token, function(err, balance) {
        balance.should.be.a('number');
        done();
      });
    });
  });
});
