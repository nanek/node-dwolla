var dwolla = require('../lib/dwolla');
var c = require('../config');

var newUser = {};
newUser.email = '';
newUser.password = '';
newUser.pin = '';
newUser.firstName = '';
newUser.lastName = '';
newUser.address = '';
newUser.address2 = '';
newUser.city = '';
newUser.state = '';
newUser.zip = '';
newUser.phone = '';
newUser.dateOfBirth = '';
newUser.acceptTerms = 'true';

dwolla.register(c.client_id, c.client_secret, newUser, function(err, user) {
  console.log(err);
  console.log(user);
});

