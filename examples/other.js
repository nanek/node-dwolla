var dwolla = require('../lib/dwolla');
var c = require('../config');

var account_id = '812-728-8151'; //use valid id
dwolla.basicAccountInfo(c.client_id, c.client_secret, account_id, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

var lat = '41.58454600';
var lon = '-93.63416700';
dwolla.nearby(c.client_id, c.client_secret, lat, lon, function(err, data) {
  if (err) { console.log(err); }
  console.log(data.length);
});

dwolla.transactions(c.token, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

dwolla.fundingSources(c.token, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});
