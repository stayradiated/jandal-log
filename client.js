var net = require('net');

var PORT = 8800;

var Client = function (fn) {
  this.connection = net.connect({ port: PORT }, fn);
};

Client.prototype.write = function (message) {
  this.connection.write(message);
};

Client.prototype.end = function () {
  this.connection.end();
};

module.exports = Client;
