var dwolla = require('../lib/dwolla');
var c = require('../config');

var destinationId = ''; // set valid destinationId
var amount = 1;
var params = { destinationType: 'Email' }; // set destinationType to match destinationId
dwolla.send(c.token, c.pin, destinationId, amount, params, function(err, tran) {
  console.log(err);
  console.log(tran);
});

