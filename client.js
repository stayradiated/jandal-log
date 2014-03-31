var net = require('net');

var PORT = 8800;

var Client = function (fn) {
  this.connection = net.connect({ port: PORT }, fn);
  this.connection.on('error', function (err) {
    console.log('Jandal-Log - Could not connect to server');
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
  if (! this.connection.writable) return;

  name = new Buffer(name);
  var bytes = Buffer.concat([GROUP, PREFIX, name, EOL]);
  this.connection.write(bytes);
};

Client.prototype.end = function () {
  this.connection.end();
};

Client.infect = function (jandal) {
  var client = new Client();

  // incoming
  if (! jandal.infected) {
    var process = jandal._process;
    jandal._process = function (message) {
      var sender = 'client:' + jandal.id.slice(0,2);
      client.write(sender, message);
      return process.call(jandal, message);
    };
    jandal.infected = true;
  }

  // outgoing
  if (! jandal._handle.infected) {
    var write = jandal._handle.write;
    jandal._handle.write = function (socket, message) {
      var sender = 'server:' + socket.id.slice(0,2);
      client.write(sender, message);
      return write(socket, message);
    };
    jandal._handle.infected = true;
  }

  return client;
};

module.exports = Client;
