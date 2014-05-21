# Dwolla API for node.js
[Dwolla Developers](https://www.dwolla.com/developers)

## Methods

Requires your Dwolla application client_id and client_secret.

  * basicAccountInfo(client_id, client_secret, id, fn)
  * nearby(client_id, client_secret, lat, lon, [, params], fn)
  * register(client_id, client_secret, userInfo, fn)

Requires a valid user OAuth2 token. Note tokens do not expire and may be
reused.

  * fullAccountInfo(oauth_token, fn)
  * balance(oauth_token, fn)
  * contacts(oauth_token[, params], fn)
  * transactions(oauth_token[, params], fn)
  * transactionById(oauth_token, id, fn)
  * transactionsStats(oauth_token[, params], fn)
  * send(oauth_token, pin, destinationId, amount[, params], fn)
  * request(oauth_token, pin, sourceId, amount[, params], fn)
  * fundingSources(oauth_token, fn)
  * fundingSourceById(oauth_token, id, fn)
  * deposit(oauth_token, pin, sourceId, amount, fn)
  * fulfill(oauth_token, pin, sourceId[, params], fn)
  * pending(oauth_token, callback)
  * withdraw(oauth_token, pin, sourceId, amount, fn)

  All optional parameters are passed in as an optional object before the callback.

## Sandbox Support

If you desire to test your application with Dwolla's UAT sandbox, you can 
dynamically toggle between UAT and non-UAT modes:

  * toggleUAT() will switch between sandbox and non-sandbox mode
  * isUAT() returns a bool which indicates whether or not sandbox mode is enabled

The sandbox environment is disabled by default. 

### How to obtain a Dwolla OAuth2 token

To authenticate a user, follow the examples from one of the following modules.

#### everyauth

[everyauth](http://everyauth.com/) is an authentication and authorization module for your node.js Connect and Express apps. See http://everyauth.com/#other-modules/dwolla-oauth2

#### passport-dwolla

[Passport](http://passportjs.org/) is authentication middleware for Node.js, popular for being lightweight, modular, and flexible. A strategy for authenticating with Dwolla, along with an example, is available in the [passport-dwolla](https://github.com/jaredhanson/passport-dwolla) module.

#### Dwolla Developer Site

The Dwolla [Generate Token](http://developers.dwolla.com/dev/token) tool allows you
create a valid OAuth token for testing purposes.

## Installation

    $ npm install dwolla

## Example Usage
See more examples in the examples folder.

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
Tests use mocha and should.js. Tests were made only for GET requests,
as tests of POST requests would be processed just like real requests.
Although working examples of each POST request can be found in the
examples folder.

    $ npm test

or

    $ mocha
