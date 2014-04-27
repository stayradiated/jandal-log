var Client = require('../lib/client');
var client = new Client(function () {
  client.message('server:10', 'event(20)');
  client.end();
});

