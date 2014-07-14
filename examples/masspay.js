var dwolla = require('../lib/dwolla');
var c = require('../config');

var items = [];
var transaction1 = {};
transaction1.amount = 1.00;
transaction1.destination = "b@dwolla.com";
items.push(transaction1);

var fS = "Balance";

// NOTE: Optional parameters can also be passed in.
// View MassPay documentation here: https://developers.dwolla.com/dev/docs/masspay

// Create MassPay job (masspay/create)
dwolla.createMassPayJob(c.token, fS, c.pin, items, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

var jobId = "Valid Job ID here";

// Check status of MassPay job (masspay/job)
dwolla.getMassPayJob(c.token, jobId, function(err, data) {
	if (err) { console.log(err); }
	console.log(data);
});

// Get all transactions from MassPay Job (masspay/jobs/items)
dwolla.getMassPayJobItems(c.token, jobId, function(err, data) {
	if (err) { console.log(err); }
	console.log(data);
});
