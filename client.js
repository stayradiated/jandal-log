var net = require('net');

var PORT = 8800;

var Client = function (fn) {
  this.connection = net.connect({ port: PORT }, fn);
  this.connection.on('error', function (err) {
    console.log('Jandal-Log', err);
  });
};

var PREFIX = new Buffer([29]);
var MESSAGE = new Buffer('message');
var GROUP = new Buffer('group');
var SEPERATOR = new Buffer([31]);
var EOL = new Buffer([30]);

Client.prototype.write = function (sender, message) {

  if (! this.connection.writable) return;

  sender = new Buffer(sender);
  message = new Buffer(message);
  var bytes = Buffer.concat([MESSAGE, PREFIX, sender, SEPERATOR, message, EOL]);

  this.connection.write(bytes);
};

Client.prototype.group = function (name) {
  name = new Buffer(name);
  var bytes = Buffer.concat([GROUP, PREFIX, name, EOL]);
  this.connection.write(bytes);
};

Client.prototype.end = function () {
  this.connection.end();
};

module.exports = Client;
