var dwolla = require('../lib/dwolla');
var c = require('../config');

if (c.pin === null) return 'Missing DWOLLA_PIN';
if (c.token === null) return 'Missing DWOLLA_TOKEN';

var destinationId = 'shiff2kl@yahoo.com';
var amount = 1;
var params = { destinationType: 'Email' };
dwolla.send(c.token, c.pin, destinationId, amount, params, function(err, tran) {
  console.log(err);
  console.log(tran);
});

