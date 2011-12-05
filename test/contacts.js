var dwolla = require('../lib/dwolla');
var should = require('should');
var c = require('../config');

describe('Contacts', function() {
  describe('User Contacts', function() {
    it('should respond with an array', function(done) {
      dwolla.contacts(c.token, function(err, contacts) {
        contacts.length.should.be.a('number');
        done();
      });
    });
  });
  describe('Nearby', function() {
    it('should respond with an array', function(done) {
      var lat = '41.58454600';
      var lon = '-93.63416700';
      dwolla.nearby(c.client_id, c.client_secret, lat, lon, function(err, spots) {
        spots.length.should.be.a('number');
        done();
      });
    });
  });
});
