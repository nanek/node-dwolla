var dwolla = require('../lib/dwolla');
var c = require('../config');

dwolla.contacts(c.token, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});
