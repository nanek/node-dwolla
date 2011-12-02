var dwolla = require('./lib/dwolla');

// set your dwolla application ids
var client_id = process.env.DWOLLA_CLIENT_ID;
var client_secret = process.env.DWOLLA_CLIENT_SECRET;
if (client_id === undefined) return 'Missing DWOLLA_CLIENT_ID';
if (client_secret === undefined) return 'Missing DWOLLA_CLIENT_SECRET';

var account_id = '812-728-8151'; //use valid id
dwolla.basicAccountInfo(client_id, client_secret, account_id, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

var lat = '41.58454600';
var lon = '-93.63416700';
dwolla.nearby(client_id, client_secret, lat, lon, function(err, data) {
  if (err) { console.log(err); }
  console.log(data.length);
});

// set a valid user oauth token here
var oauth_token = process.env.DWOLLA_OAUTH_TOKEN;
if (oauth_token === undefined) return 'Missing DWOLLA_OAUTH_TOKEN';

dwolla.transactions(oauth_token, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

