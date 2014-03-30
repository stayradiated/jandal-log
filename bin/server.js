#!/usr/bin/env node

var net = require('net');
var webServer = require('./index');

var PORT = 8800;

var indexOf = function (bytes, byte) {
  return Array.prototype.indexOf.call(bytes, byte);
};

var server = net.createServer(function (connection) {

  webServer.reset();

  connection.on('data', function (bytes) {

    var eol;

    while ((eol = indexOf(bytes, 30)) > -1) {

      var line = bytes.slice(0, eol);
      bytes = bytes.slice(eol + 1);

      var prefix = indexOf(line, 29);
      var type = line.slice(0, prefix).toString();
      line = line.slice(prefix + 1);

      switch (type) {

        case 'message':

          var split = indexOf(line, 31);
          var sender = line.slice(0, split).toString();
          var message = line.slice(split + 1).toString();

          webServer.message(sender, message);
          break;

        case 'group':

          var name = line.toString();

          webServer.group(name);
          break;

      }

    } 

  });

});

server.listen(PORT);
