# Dwolla API for node.js
[Dwolla Developers](https://www.dwolla.com/developers)

## Methods

Requires your Dwolla application client_id and client_secret.

  * basicAccountInfo(client_id, client_secret, id, callback)
  * nearby(client_id, client_secret, lat, lon, [, params], callback)

Requires a valid user OAuth2 token. Note token do not expire and may be
reused. See https://github.com/bnoguchi/everyauth for an example on how
to get authorize and get a Dwolla OAuth2 token.

  * fullAccountInfo(oauth_token, callback)
  * balance(oauth_token, callback)
  * contacts(oauth_token[, params], callback)
  * transactions(oauth_token[, params], callback)
  * transactionById(oauth_token, id, callback)
  * transactionsStats(oauth_token[, params], callback)

All optional parameters are passed in as an optional object before the callback.

## Installation

    $ npm install dwolla

## Example Usage
See examples.js.

    var dwolla = require('dwolla');

    // get oauth_token, be sure to set the proper scope
    // use oauth lib or everyauth to setup OAuth2
    // see everyauth for example Dwolla authentication
    var token = req.session.oauth_token;

    dwolla.fullAccountInfo(token, function(err, data) {
      console.log("Full Account Info: " + data);
    });

    dwolla.transactions(token, function(err, data) {
      console.log("Transactions: " + data);
    });

    var params = {};
    params.search = 'Ben';
    params.types = 'All';
    dwolla.contacts(token, params, function(err, data) {
      console.log("Contacts: " + data);
    });

## Tests
Tests use mocha and should

    $ npm test

or

    $ mocha
