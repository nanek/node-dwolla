var https = require('https');
var qs = require('querystring');

var API_PATH = '/oauth/rest';

function _request(path, params, fn) {
  var options = {
    host: 'www.dwolla.com'
    , path: API_PATH + path
  };
  if (params) {
    options.path += '?' + qs.stringify(params);
  }
  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      try {
        data = JSON.parse(data);
        if (data.Success) {
          fn(null, data.Response);
        } else {
          fn(data.Message, null);
        }
      } catch (e) {
        fn('Error parsing response from dwolla api.', data);
      }
    });
  });
  req.end();
}

/**
 * Retrieves the basic account information for the Dwolla account associated with the account identifier.
 * https://www.dwolla.com/developers/endpoints/users/basicinformation
 *
 * @param {String}     client_id
 * @param {String}     client_secret
 * @param {String}     id
 * @param {Function}   fn
 **/
exports.basicAccountInfo = function(client_id, client_secret, id, fn) {
  var path = '/users/' + id;
  var params = {};
  params.client_id = client_id;
  params.client_secret = client_secret;
  _request(path, params, fn);
};

/**
 * Retrieves the account information for the user assoicated with the authorized access token.
 * https://www.dwolla.com/developers/endpoints/users/accountinformation
 *
 * @param {String}     oauth_token
 * @param {Function}   fn
 **/
exports.fullAccountInfo = function(oauth_token, fn) {
  var params = { oauth_token: oauth_token };
  _request('/users/', params, fn);
};

/**
 * Retrieves the account balance for the user for the authorized access token.
 * https://www.dwolla.com/developers/endpoints/balance/account
 *
 * @param {String}     oauth_token
 * @param {Function}   fn
 * */
exports.balance = function(oauth_token, fn) {
  var params = { oauth_token: oauth_token };
  _request('/balance/', params, fn);
};

/**
 * Retrieves contacts for the user for the authorized access token.
 * https://www.dwolla.com/developers/endpoints/contacts/user
 *
 * Optional params:
 *
 *   - search
 *   - types
 *   - limit
 *
 * @param {String}     oauth_token
 * @param {Object}     params
 * @param {Function}   fn
 * */
exports.contacts = function(oauth_token, params, fn) {
  // params are optional
  if (!fn || typeof params === 'function') {
    fn = params;
    params = {};
  }
  params = params || {};
  params.oauth_token = oauth_token;
  _request('/contacts/', params, fn);
};

/**
 * Retrieves nearby Dwolla spots within the range of the provided latitude and longitude.
 * Half of the limit are returned as spots with closest proximity. The other half of the spots
 * are returned as random spots within the range.
 * https://www.dwolla.com/developers/endpoints/contacts/nearby
 *
 * Optional params:
 *
 *   - range
 *   - limit
 *
 * @param {String}   client_id
 * @param {String}   client_secret
 * @param {String}   lat
 * @param {String}   lon
 * @param {Object}   params
 * @param {Function} fn
 **/
exports.nearby = function(client_id, client_secret, lat, lon, params, fn) {
  // params are optional
  if (!fn || typeof params === 'function') {
    fn = params;
    params = {};
  }
  if (client_id !== null) {
    params = params || {};
    params.client_id = client_id;
    params.client_secret = client_secret;
    params.latitude = lat;
    params.longitude = lon;

    _request('/contacts/nearby', params, fn);
  } else {
    console.log('Missing client_id and client_secret');
  }
};

/**
 * Retrieves transactions for the user for the authorized access token.
 * Transactions are returned in descending order by transaction date.
 * https://www.dwolla.com/developers/endpoints/transactions/details
 *
 * @param {String}     oauth_token
 * @param {int}        transactionId
 * @param {Function}   fn
 **/
exports.transactionById = function(oauth_token, id, fn) {
  var params = { oauth_token: oauth_token };
  _request('/transactions/' + id, params, fn);
};

/**
 * Retrieves transactions for the user for the authorized access token.
 * Transactions are returned in descending order by transaction date.
 * https://www.dwolla.com/developers/endpoints/transactions/list
 *
 * Optional params:
 *
 *   - sinceDate
 *   - types
 *   - limit
 *   - skip
 *
 * @param {String}     oauth_token
 * @param {Object}     params
 * @param {Function}   fn
 **/
exports.transactions = function(oauth_token, params, fn) {
  // params are optional
  if (!fn || typeof params === 'function') {
    fn = params;
    params = {};
  }
  params = params || {};
  params.oauth_token = oauth_token;
  _request('/transactions/', params, fn);
};

/**
 * Retrieves transactions stats for the user for the authorized access token.
 * https://www.dwolla.com/developers/endpoints/transactions/stats
 *
 * Optional params:
 *
 *   - types
 *   - startDate
 *   - endDate
 *
 * @param {String}     oauth_token
 * @param {Object}     params
 * @param {Function}   fn
 **/
exports.transactionsStats = function(oauth_token, params, fn) {
  // params are optional
  if (!fn || typeof params === 'function') {
    fn = params;
    params = {};
  }
  params = params || {};
  params.oauth_token = oauth_token;
  _request('/transactions/stats', params, fn);
};
