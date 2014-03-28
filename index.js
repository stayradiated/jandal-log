var express = require('express');
var sockjs = require('sockjs');
var Jandal = require('jandal');

var PORT = 8888;

var app = express();

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
});

var server = app.listen(PORT);

var connection = sockjs.createServer();
connection.installHandlers(server, { prefix: '/socket' });

connection.on('connection', function (socket) {
  var jandal = new Jandal(socket, 'stream');
});

module.exports = {
  write: function (message) {
    console.log('emitting message', message);
    Jandal.all.emit('message', message);
  }
};
