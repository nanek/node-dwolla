var dwolla = require('../lib/dwolla');
var c = require('../config');

var sourceId = ''; // Add valid sourceId
var amount = 1;
var params = { sourceType: 'Email' }; // Set sourceType to match sourceId type
dwolla.request(c.token, c.pin, sourceId, amount, params, function(err, tran) {
  console.log(err);
  console.log(tran);
});

