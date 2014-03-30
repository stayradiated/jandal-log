var express = require('express');
var sockjs = require('sockjs');
var Jandal = require('jandal');
var Messages = require('jandal/source/message');
var log = require('log_')('Server', 'blue');

var PORT = 8888;

var app = express();

app.configure(function () {
  app.use(express.static(__dirname + '/../public'));
});

var server = app.listen(PORT);

var connection = sockjs.createServer();
connection.installHandlers(server, { prefix: '/socket' });

connection.on('connection', function (socket) {
  var jandal = new Jandal(socket, 'stream');
});

var messages = new Messages({
  getFn: function (id) {
    return function () {
      return id;
    };
  }
});

module.exports = {

  reset: function () {
    Jandal.all.emit('reset');
  },

  group: function (name) {
    Jandal.all.emit('group', name);
  },

  message: function (sender, message) {

    message = messages.parse(message);
    if (! message) return;

    message.sender = sender;
    message.senderType = sender.split(':')[0];

    for (var i = 1; i <= 3; i++) {

      var arg = 'arg' + i;
      var value = message[arg];

      if (value === undefined) {
        message[arg] = '';
      }
      else if (typeof value === 'function') {
        message[arg] = 'fn_' + value();
      }
      else {
        message[arg] = JSON.stringify(value);
      }

    }

    Jandal.all.emit('message', message);
  }
};

log('Started web server on port ' + PORT);
