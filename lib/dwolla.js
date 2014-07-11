var https = require('https');
var qs    = require('querystring');

var API_PATH = '/oauth/rest';

var PRODUCTION_HOST = 'www.dwolla.com';
var SANDBOX_HOST = 'uat.dwolla.com';

function resHandler(fn) {
  return function (res) {
    var data = '';

    res.on('data', function (chunk) {
      data += chunk;
    });

    function onEnd() {
      res.removeListener('error', onError);

      try {
        data = JSON.parse(data);
      } catch (e) {
        var err = new Error('Error parsing response from Dwolla API.');

        err.body      = data;
        err.exception = e;

        fn(err);
      }
      if (data.Success) {
        fn(null, data.Response);
      } else {
        var err  = new Error(data.Message);
        err.body = data;
        fn(err);
      }
    }

    function onError(err) {
      res.removeListener('end', onEnd);
      fn(err);
    }

    res.once('end', onEnd);
    res.once('error', onError);
  };
}

function _request(path, params, fn) {
  var options = {
    host: exports.sandbox ? SANDBOX_HOST : PRODUCTION_HOST,
    path: API_PATH + path
  };
  if (params) {
    options.path += '?' + qs.stringify(params);
  }
  var req = https.request(options, resHandler(fn));
  req.end();
}

function _post(path, post_data, fn) {
  var options = {
    host:    exports.sandbox ? SANDBOX_HOST : PRODUCTION_HOST,
    path:    API_PATH + path,
    method:  'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var req = https.request(options, resHandler(fn));
  req.write(JSON.stringify(post_data));
  req.end();
}

/**
 * Toggle to use the UAT sandbox environment or the actual production Dwolla environment. 
 *
 * You can read more about the sandboxed environment below: 
 * https://developers.dwolla.com/dev/pages/sandbox
 **/

exports.sandbox = false;

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
 * @param {int}        id
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
 * @param {String}     id
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

/**
 * Adds a funding source to the account authorized to the current
 * oauth_token
 * https://developers.dwolla.com/dev/docs/funding/add
 *
 * @param {String}     oauth_token
 * @param {Number}     account_number
 * @param {String}     routing_numbers
 * @param {String}     account_type
 * @param {String}     name
 * @param {Function}   fn
 */
exports.addFundingSource = function(oauth_token, account_number, routing_number, account_type, name, fn) {
  if (typeof fn !== 'function') { throw new Error('Missing callback'); }
  if (!oauth_token) { throw new Error('Missing arg oauth_token'); }
  if (!account_number) { throw new Error('Missing arg account_number'); }
  if (!routing_number) { throw new Error('Missing arg routing_number'); }
  if (!account_type) { throw new Error('Missing arg account_type'); }
  if (!name) { throw new Error('Missing arg name'); }

  var params = {};
  params.oauth_token = oauth_token;
  params.account_number = account_number;
  params.routing_number = routing_number;
  params.account_type = account_type;
  params.name = name;

  _post('/fundingsources/', params, fn);
};

/**
 * Verifies an added funding source to a Dwolla account
 * http://developers.dwolla.com/dev/docs/funding/verify
 *
 * @param {String}     oauth_token
 * @param {Number}     deposit1
 * @param {Number}     deposit2
 * @param {String}     id
 * @param {Function}   fn
 */
exports.verifyFundingSource = function(oauth_token, deposit1, deposit2, id, fn) {
    if (typeof fn !== 'function') { throw new Error('Missing callback'); }
    if (!oauth_token) { throw new Error('Missing arg oauth_token'); }
    if (!deposit1) { throw new Error('Missing arg deposit1'); }
    if (!deposit2) { throw new Error('Missing arg deposit2'); }
    if (!id) { throw new Error('Missing arg id'); }


    var params = {};
    params.oauth_token = oauth_token;
    params.deposit1 = deposit1;
    params.deposit2 = deposit2;
    params.id = id;
    _post('/fundingsources/' + id + '/verify', params, fn);
};

/**
 * Moves an amount in to Dwolla from a funding source for the user
 * associated with the authorized access token.
 * http://developers.dwolla.com/dev/docs/funding/deposit
 *
 * @param {String}     oauth_token
 * @param {Number}     pin
 * @param {String}     sourceId
 * @param {String}     amount
 * @param {Function}   fn
 */
exports.deposit = function(oauth_token, pin, sourceId, amount, fn) {
    if (typeof fn !== 'function') { throw new Error('Missing callback'); }
    if (!oauth_token) { throw new Error('Missing arg oauth_token'); }
    if (!pin) { throw new Error('Missing arg pin'); }
    if (!sourceId) { throw new Error('Missing arg sourceId'); }
    if (!amount) { throw new Error('Missing arg amount'); }


    var params = {};
    params.oauth_token = oauth_token;
    params.pin = pin;
    params.sourceId= sourceId;
    params.amount = amount;
    _post('/fundingsources/' + id + '/withdraw', params, fn);
};

/**
 * Fulfills a pending transaction for the user associated
 * with the authorized access token.
 * http://developers.dwolla.com/dev/docs/requests/fulfill
 *
 * Optional params:
 *
 *   - assumeCosts
 *   - facilitatorAmount
 *   - notes
 *
 * @param {String}     oauth_token
 * @param {Number}     pin
 * @param {String}     sourceId
 * @param {Function}   fn
 */
exports.fulfill = function(oauth_token, pin, sourceId, params, fn) {
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
    _post('/requests/' + sourceId + '/fulfill', params, fn);
};

/**
 * Retrieves a list of pending transactions for the user
 * associated with the authorized access token.
 * http://developers.dwolla.com/dev/docs/requests/pending
 *
 * @param {String}     oauth_token
 * @param {Function}   fn
 */
exports.pending = function(oauth_token, fn) {
    if (typeof fn !== 'function') { throw new Error('Missing callback'); }
    if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

    var params = { oauth_token: oauth_token };
    _request('/requests/', params, fn);
};

/**
 * Moves an amount from Dwolla into a funding source for the user
 * associated with the authorized access token.
 * http://developers.dwolla.com/dev/docs/funding/withdraw
 *
 * @param {String}     oauth_token
 * @param {Number}     pin
 * @param {String}     sourceId
 * @param {String}     amount
 * @param {Function}   fn
 */
exports.withdraw = function(oauth_token, pin, sourceId, amount, fn) {
    if (typeof fn !== 'function') { throw new Error('Missing callback'); }
    if (!oauth_token) { throw new Error('Missing arg oauth_token'); }
    if (!pin) { throw new Error('Missing arg pin'); }
    if (!sourceId) { throw new Error('Missing arg sourceId'); }
    if (!amount) { throw new Error('Missing arg amount'); }

    var params = {};
    params.oauth_token = oauth_token;
    params.amount = amount;
    params.pin    = pin;
    _post('/fundingsources/' + sourceId + '/withdraw', params, fn);
};

    /**
     * Creates a MassPay Job for the user for the authorized access token.
     * Takes an array of objects, each containing amount, destination, 
     * destinationType, and note as items.
     *
     * https://developers.dwolla.com/dev/docs/masspay/create

     * Required arguments:
     * 
     * @param {String}      oauth_token
     * @param {string}      fundsSource
     * @param {int}         pin
     * @param {array}       items
     * @param {object}      params
     * @param {function}    fn   
     *
     * Optional params:
     *
     * boolean assumeCosts
     * string userJobId
     *
     **/

    exports.createMassPayJob = function(oauth_token, fundsSource, pin, items, params, fn) {
      // params are optional
      if (!fn || typeof params === 'function') {
        fn = params;
        params = {};
      }

      if (typeof fn !== 'function') { throw new Error('Missing callback'); }
      if (!oauth_token) { throw new Error('Missing arg oauth_token'); }
      if (!pin) { throw new Error('Missing arg pin'); }
      if (!fundsSource) { throw new Error('Missing arg fundsSource'); }
      if (!items) { throw new Error('Missing arg items'); }

      params = params || {};
      params.oauth_token = oauth_token;
      params.fundsSource = fundsSource;
      params.pin = pin;
      params.items = items;
      _post('/masspay/', params, fn);
    }

    /**
     * Fetches details about an existing MassPay Job, given a job_id.
     *
     * https://developers.dwolla.com/dev/docs/masspay/job

     * Required arguments:
     * 
     * @param {String}      oauth_token
     * @param {string}      job_id
     * @param {function}    fn   
     *
     **/

    exports.getMassPayJob = function(oauth_token, job_id, fn) {
      if (typeof fn !== 'function') { throw new Error('Missing callback'); }
      if (!job_id) { throw new Error('Missing Job ID'); }
      if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

      params = {};
      params.oauth_token = oauth_token;

      _request('/masspay/' + job_id, params, fn)
    }

    /**
     * Fetches all Items for a MassPay Job, given a job_id.
     *
     * https://developers.dwolla.com/dev/docs/masspay/jobs/items

     * Required arguments:
     * 
     * @param {String}      oauth_token
     * @param {string}      job_id
     * @param {function}    fn   
     *
     * Optional arguments:
     *
     * @param {integer}     limit
     * @param {integer}     skip
     *
     **/

    exports.getMassPayJobItems = function(oauth_token, job_id, params, fn) {
      if (typeof fn !== 'function') { throw new Error('Missing callback'); }

       // params are optional
      if (!fn || typeof params === 'function') {
        fn = params;
        params = {};
      }

      if (!job_id) { throw new Error('Missing Job ID'); }
      if (typeof fn !== 'function') { throw new Error('Missing callback'); }
      if (!oauth_token) { throw new Error('Missing arg oauth_token'); }

      params = params || {};
      params.oauth_token = oauth_token;

      _request('/masspay/' + job_id + '/items', params, fn)
    }