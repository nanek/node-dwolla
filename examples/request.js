var dwolla = require('../lib/dwolla');
var c = require('../config');

if (c.pin === null) return 'Missing DWOLLA_PIN';
if (c.token === null) return 'Missing DWOLLA_TOKEN';

var sourceId = 'shiff2kl@yahoo.com';
var amount = 1;
var params = { sourceType: 'Email' };
dwolla.request(c.token, c.pin, sourceId, amount, params, function(err, tran) {
  console.log(err);
  console.log(tran);
});

