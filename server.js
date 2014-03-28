var net = require('net');
var webServer = require('./index');

var PORT = 8800;

var server = net.createServer(function (connection) {

  console.log('got a new connection');

  connection.on('data', function (message) {
    webServer.write(message.toString());
  });

});

server.listen(PORT);
