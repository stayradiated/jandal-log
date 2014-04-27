'use strict';

var inherits     = require('util').inherits; 
var EventEmitter = require('events').EventEmitter;

/*
 * EVENTS:
 *
 * - read : a message is being sent to the socket
 * - write : a message is being sent from the socket
 * - close : the socket is being closed
 *
 */

var Socket = function Socket () {
  Socket.super_.apply(this, arguments);

  this.end   = this.end.bind(this);
  this.close = this.close.bind(this);
  this.pipe  = this.pipe.bind(this);

  this.open = true;
};

inherits(Socket, EventEmitter);

Socket.prototype.pipe = function pipe (socket) {
  this.on('close', function pipeClose (status, message) {
    return socket.close(status, message);
  });
  this.on('write', function pipeWrite (message) {
    return socket.emit('read', message);
  });
  return socket;
};

Socket.prototype.end = function end () {
  return this.close();
};

Socket.prototype.close = function close (status, message) {
  if (! this.open) return;
  this.open = false;
  return this.emit('close', status, message);
};


module.exports = Socket;
