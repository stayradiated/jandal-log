'use strict';

var Socket = require('../lib/socket');
var assert = require('chai').assert;

describe('socket', function () {

  var socket;

  beforeEach(function () {
    socket = new Socket();
  });

  afterEach(function () {
    socket.close();
  });

  describe('#events', function () {

    it('should inherit from EventEmitter', function () {
      assert(socket.addListener);
      assert(socket.on);
      assert(socket.once);
      assert(socket.removeListener);
      assert(socket.removeAllListeners);
      assert(socket.setMaxListeners);
      assert(socket.listeners);
      assert(socket.emit);
    });

    it('should emit events', function (done) {
      socket.on('event', function () {
        done();
      });
      socket.emit('event');
    });

  });

  describe('.pipe', function () {

    var output;

    beforeEach(function () {
      output = new Socket();
    });

    afterEach(function () {
      output.end();
    });

    it('should pipe a socket to another socket', function (done) {
      socket.pipe(output);

      output.on('read', function (message) {
        assert.equal(message, 'hello world');
        done();
      });

      socket.emit('write', 'hello world');
    });

    it('should create a two-way socket', function (done) {
      socket.pipe(output);
      output.pipe(socket);

      socket.on('read', function (message) {
        assert.equal(message, 'bar');
        done();
      });

      output.on('read', function (message) {
        assert.equal(message, 'foo');
        output.emit('write', 'bar');
      });

      socket.emit('write', 'foo');
    });

    it('should close output stream', function (done) {
      socket.pipe(output);

      output.on('close', function () {
        done();
      });
      
      socket.end();
    });

  });

});
