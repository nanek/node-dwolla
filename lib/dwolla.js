var https = require('https');
var qs = require('querystring');

var keys = {
  client_id: process.env.DWOLLA_CLIENT_ID
  , client_secret: process.env.DWOLLA_CLIENT_SECRET
};

var defaultOptions = {
  host: 'www.dwolla.com',
};

var ACCOUNT_API_PATH = '/oauth/rest/accountapi';

function _request(path, params, fn) {
  var options = defaultOptions;
  options.path = ACCOUNT_API_PATH + path;
  if (params) {
    options.path += '?' + qs.stringify(params);
  }
  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      data = JSON.parse(data);
      fn(null, data);
    });
  });
  req.end();
}

/**
 * Retrieves the basic account information for the Dwolla account associated with the account identifier.
 * https://www.dwolla.com/developers/endpoints/accountapi/accountinformation
 **/
exports.basicAccountInfo = function(id, fn) {
  var path = '/accountinformation/' + id;
  _request(path, keys, fn);
};

/**
 * Retrieves the account information for the user assoicated with the authorized access token.
 * https://www.dwolla.com/developers/endpoints/accountapi/accountinformation
 **/
exports.fullAccountInfo = function(oauth_token, fn) {
  var params = { oauth_token: oauth_token };
  _request('/accountinformation', params, fn);
};

/**
 * Retrieves the account balance for the user for the authorized access token.
 * https://www.dwolla.com/developers/endpoints/accountapi/balance
 * */
exports.balance = function(oauth_token, fn) {
  var params = { oauth_token: oauth_token };
  _request('/balance', params, fn);
};

/**
 * Retrieves contacts for the user for the authorized access token.
 * https://www.dwolla.com/developers/endpoints/accountapi/contacts
 *
 * @param {String}  search
 * @param {String}  types
 * @param {int}     limit
 * */
exports.contacts = function(oauth_token, params, fn) {
  params = params || {};
  params.oauth_token = oauth_token;
  _request('/contacts', params, fn);
};

/**
 * Retrieves nearby Dwolla spots within the range of the provided latitude and longitude.
 * Half of the limit are returned as spots with closest proximity. The other half of the spots
 * are returned as random spots within the range.
 * https://www.dwolla.com/developers/endpoints/accountapi/nearby
 *
 * @param {String}  lat
 * @param {String}  long
 * @param {int}     range
 * @param {int}     limit
 **/
exports.nearby = function(lat, lon, params, fn) {
  params = params || {};
  params.client_id = keys.client_id;
  params.client_secret = keys.client_secret;
  params.latitude = lat;
  params.longitude = lon;

  _request('/nearby', params, fn);
};

/**
 * Retrieves transactions for the user for the authorized access token.
 * Transactions are returned in descending order by transaction date.
 * https://www.dwolla.com/developers/endpoints/accountapi/transactions
 *
 * @param {int}    transactionId 
 **/
exports.transactionById = function(oauth_token, id, fn) {
  var params = { oauth_token: oauth_token };
  _request('/transactions' + id, params, fn);
};

/**
 * Retrieves transactions for the user for the authorized access token.
 * Transactions are returned in descending order by transaction date.
 * https://www.dwolla.com/developers/endpoints/accountapi/transactions
 *
 * @param {String}  sinceDate
 * @param {String}  types
 * @param {int}     limit
 * @param {int}     skip
 **/
exports.transactions = function(oauth_token, params, fn) {
  params = params || {};
  params.oauth_token = oauth_token;
  _request('/transactions', params, fn);
};

/**
 * Retrieves transactions stats for the user for the authorized access token.
 * https://www.dwolla.com/developers/endpoints/accountapi/transactions
 *
 * @param {String}  types
 * @param {String}  startDate
 * @param {String}  endDate
 **/
exports.transactionsStats = function(oauth_token, params, fn) {
  params = params || {};
  params.oauth_token = oauth_token;
  _request('/transactions/stats', params, fn);
};
