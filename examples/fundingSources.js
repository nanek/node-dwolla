// Include the Dwolla library and configuration
var dwolla = require('../lib/dwolla');
var c = require('../config');

// Example 1: List all funding sources for current users' OAuth Token
dwolla.fundingSources(c.token, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

// Example 2: Get information for funding source with ID '999999' for 
// 			  current user's OAuth token

dwolla.fundingSourceById(c.token, '999999', function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

// Example 3: Add a checking account to the Dwolla account associated
//			  with the OAuth token, with routing numbers '99999999'
//			  and name "My bank"
dwolla.addFundingSource(c.token, '99999999', '99999999', 'Checking', 'My bank', function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

// Example 4: Verify a funding source added with ID '999999' and 
//			  mini-deposit amounts of $0.02 and $0.07.
dwolla.verifyFundingSource(c.token, 0.02, 0.07, '999999', function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});