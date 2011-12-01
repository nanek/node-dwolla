var dwolla = require('./lib/dwolla');

var accountId = '812-728-8151'; //'812-111-1111'; //use valid id
dwolla.basicAccountInfo(accountId, function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

var lat = '41.58454600';
var lon = '-93.63416700';
dwolla.nearby(lat, lon, null, function(err, data) {
  if (err) { console.log(err); }
  console.log(data.length);
});
