# Dwolla API for node.js
[Dwolla Developers](https://www.dwolla.com/developers)

## Methods

Requires application client_id and client_secret

  * basicAccountInfo
  * nearby(lat, long)

Requires OAuth2 Token

  * fullAccountInfo
  * balance
  * contacts
  * transactionById(id)
  * transactions
  * transactionsStats

## Installation

    $ npm install dwolla

You need to register your application with Dwolla to get a client_id and
client_secret to make API requests. Set these as env variables.

    DWOLLA_CLIENT_ID=''
    DWOLLA_CLIENT_SECRET=''

## Example Usage

    var dwolla = require('dwolla');

    // get oauth_token, be sure to set the proper scope
    // use oauth lib or everyauth to setup OAuth2
    // see everyauth for example Dwolla authentication
    var token = req.session.oauth_token;

    dwolla.fullAccountInfo(token, function(err, data) {
      console.log("Full Account Info: " + data);
    });
    dwolla.transactions(token, null, function(err, data) {
      console.log("Transactions: " + data);
    });
    var params = {};
    params.search = 'Ben';
    params.types = 'All';
    dwolla.contacts(token, params, function(err, data) {
      console.log("Contacts: " + data);
    });
