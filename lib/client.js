var dnode = require('dnode');
var config = require('../config');
var log = require('log_')('Jandal-Log', 'yellow');

var Client = function (fn) {
  var self = this;
  this.connection = dnode.connect(config.dnode_port);
  this.connection.on('error', function (err) {
    log('Jandal-Log - Could not connect to server');
  });
  this.connection.on('remote', function (remote) {
    log('Jandal-Log - Connected to server');
    self.remote = remote;
    self.message = remote.message;
    self.group = remote.group;
    self.reset = remote.reset;
    fn(self);
  });
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
      client.message(sender, message);
      return process.call(jandal, message);
    };
    jandal.infected = true;
  }

  // outgoing
  if (! jandal._handle.infected) {
    var write = jandal._handle.write;
    jandal._handle.write = function (socket, message) {
      var sender = 'server:' + socket.id.slice(0,2);
      client.message(sender, message);
      return write(socket, message);
    };
    jandal._handle.infected = true;
  }

  return client;
};

module.exports = Client;
