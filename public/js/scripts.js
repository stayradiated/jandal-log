(function () {

  'use strict';

  var connection = new SockJS('/socket');
  var socket = new Jandal(connection, 'websocket');
  var log = document.querySelector('.log');

  var template = function (_) {
    return [
      '<li class="' + _.sender + '">',
        _.message,
      '</li>'
    ].join('');
  };

  socket.on('message', function(message) {
    var html = template({
      sender: 'null',
      message: message
    });
    log.innerHTML += html;
  });

}());
