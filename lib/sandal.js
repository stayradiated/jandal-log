'use strict';

var Jandal       = require('jandal');
var inherits     = require('util').inherits; 
var Socket       = require('./socket');
var Logger = require('./client');

// Create new connection to server
var logger = new Logger();

// Jandal handler based on an event emitter
var handler = {
  identify: function sandalIdentify (socket) {
    return socket.id;
  },
  write: function sandalWrite (socket, message) {
    logger.write(socket.id, message);
    return socket.emit('write', message);
  },
  onread: function sandalOnRead (socket, fn) {
    return socket.on('read', fn);
  },
  onclose: function sandalOnClose (socket, fn) {
    return socket.on('close', fn);
  },
  onerror: function sandalOnError (socket, fn) {
    return socket.on('error', fn);
  },
  onopen: function sandalOnOpen (socket, fn) {
    return process.nextTick(fn);
  },
  release: function sandalRelease (socket) {
    socket.removeAllListeners('read');
    socket.removeAllListeners('close');
    socket.removeAllListeners('error');
  }
};

/**
 * Sandal
 * 
 * For when you need to test Jandal
 */

var Sandal = function Sandal () {
  Sandal.__super__.call(this);

  this.id = Sandal._id++;

  this.serverSocket = new Socket();
  this.serverSocket.id = 'server:' + this.id;

  this.clientSocket = new Socket();
  this.clientSocket.id = 'client:' + this.id;

  this.serverSocket.pipe(this.clientSocket);
  this.clientSocket.pipe(this.serverSocket);

  this.connect(this.clientSocket, handler);
  this.on('socket.close', this.end.bind(this));
};

inherits(Sandal, Jandal);

Sandal.handler = handler;
Sandal._id = 0;

Sandal.prototype.group = function (name) {
  logger.group(name);
};

Sandal.prototype.end = function end () {
  this.clientSocket.end();
  this.serverSocket.end();
  this.clientSocket.removeAllListeners();
  return this.serverSocket.removeAllListeners();
};

module.exports = Sandal;

