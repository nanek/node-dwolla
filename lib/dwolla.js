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
      } catch (e) {
        fn('Error parsing response from Dwolla API.', data);
      }
      if (data.Success) {
        fn(null, data.Response);
      } else {
        fn(data.Message);
      }
    });
  });
  req.end();
}

function _post(path, post_data, fn) {
  var options = {
    host: 'www.dwolla.com'
    , path: API_PATH + path
    , method: 'POST'
    , headers: {
      'Content-Type': 'application/json'
    }
  };
  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      try {
        data = JSON.parse(data);
      } catch (e) {
        fn('Error parsing response from Dwolla API.', data);
      }
      if (data.Success) {
        fn(null, data.Response);
      } else {
        fn(data.Message);
      }
    });
  });
  req.write(JSON.stringify(post_data));
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
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!client_id) { throw new Error('Missing arg client_id'); }
  if (!client_secret) { throw new Error('Missing arg client_secret'); }
  if (!id) { throw new Error('Missing arg id'); }

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
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

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
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

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
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

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
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!client_id) { throw new Error('Missing arg client_id'); }
  if (!client_secret) { throw new Error('Missing arg client_secret'); }
  if (!lat) { throw new Error('Missing arg lat'); }
  if (!lon) { throw new Error('Missing arg lon'); }

  params = params || {};
  params.client_id = client_id;
  params.client_secret = client_secret;
  params.latitude = lat;
  params.longitude = lon;

  _request('/contacts/nearby', params, fn);
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
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

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
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

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
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

  params = params || {};
  params.oauth_token = oauth_token;
  _request('/transactions/stats', params, fn);
};

/**
 * Send funds to a destination user for the user associated with the authorized access token.
 * https://www.dwolla.com/developers/endpoints/transactions/send
 *
 * Optional params:
 *
 *   - destinationType
 *   - facilitatorAmount
 *   - assumeCosts
 *   - notes
 *
 * @param {String}   oauth_token
 * @param {Number}   pin
 * @param {String}   destinationId
 * @param {String}   amount
 * @param {Function} fn
 */
exports.send = function(oauth_token, pin, destinationId, amount, params, fn) {
  // params are optional
  if (!fn || typeof params === 'function') {
    fn = params;
    params = {};
  }
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }
  if (!pin) { throw new Error('Missing arg pin'); }
  if (!destinationId) { throw new Error('Missing arg destinationId'); }
  if (!amount) { throw new Error('Missing arg amount'); }

  params = params || {};
  params.oauth_token = oauth_token;
  params.pin = pin;
  params.destinationId = destinationId;
  params.amount = amount;
  _post('/transactions/send', params, fn);
};

/**
 * Request funds from a source user for the user associated with the authorized access token.
 * https://www.dwolla.com/developers/endpoints/transactions/request
 *
 * Optional params:
 *
 *   - sourceType
 *   - facilitatorAmount
 *   - notes
 *
 * @param {String}   oauth_token
 * @param {Number}   pin
 * @param {String}   sourceId
 * @param {String}   amount
 * @param {Function} fn
 */
exports.request = function(oauth_token, pin, sourceId, amount, params, fn) {
  // params are optional
  if (!fn || typeof params === 'function') {
    fn = params;
    params = {};
  }
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }
  if (!pin) { throw new Error('Missing arg pin'); }
  if (!sourceId) { throw new Error('Missing arg sourceId'); }
  if (!amount) { throw new Error('Missing arg amount'); }

  params = params || {};
  params.oauth_token = oauth_token;
  params.pin = pin;
  params.sourceId= sourceId;
  params.amount = amount;
  _post('/transactions/request', params, fn);
};

/**
 * Register a new Dwolla user account.
 * https://www.dwolla.com/developers/endpoints/register/user
 *
 * @param {String} client_id
 * @param {String} client_secret
 * @param {Object} userInfo
 * @param {Function} fn
 */
exports.register = function(client_id, client_secret, userInfo, fn) {
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!client_id) { throw new Error('Missing arg client_id'); }
  if (!client_secret) { throw new Error('Missing arg client_secret'); }
  if (!userInfo) { throw new Error('Missing arg userInfo'); }

  var params = {};
  params.client_id = client_id;
  params.client_secret = client_secret;
  _post('/register/?' + qs.stringify(params), userInfo, fn);
};

/**
 * Retrieves verified funding source by identifier for the user associated with the authorized access token.
 * https://www.dwolla.com/developers/endpoints/fundingsources/details
 *
 * @param {String}     oauth_token
 * @param {String}     fundingId
 * @param {Function}   fn
 **/
exports.fundingSourceById = function(oauth_token, id, fn) {
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

  var params = { oauth_token: oauth_token };
  _request('/fundingsources/' + id, params, fn);
};

/**
 * Retrieves a list of verified funding sources for the user
 * associated with the authorized access token.
 * https://www.dwolla.com/developers/endpoints/fundingsources/list
 *
 * @param {String}     oauth_token
 * @param {Function}   fn
 **/
exports.fundingSources = function(oauth_token, fn) {
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

  var params = { oauth_token: oauth_token };
  _request('/fundingsources/', params, fn);
};

