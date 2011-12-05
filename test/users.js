var dwolla = require('../lib/dwolla');
var should = require('should');
var c = require('../config');

describe('Users', function() {
  describe('Account Information', function() {
    it('should respond with a user object', function(done) {
      dwolla.fullAccountInfo(c.token, function(err, user) {
        user.should.be.a('object');
        user.Id.should.be.a('string');
        done();
      });
    });
  });
  describe('Basic Information', function() {
    it('should respond with a user object', function(done) {
      var account_id = '812-728-8151';
      dwolla.basicAccountInfo(c.client_id, c.client_secret, account_id, function(err, user) {
        user.should.be.a('object');
        user.Id.should.be.a('string');
        done();
      });
    });
  });
});
