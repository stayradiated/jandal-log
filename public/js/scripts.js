(function () {

  'use strict';

  var connection = new SockJS('/socket');
  var socket = new Jandal(connection, 'websocket');
  var log = document.querySelector('.log tbody');

  var template = function (_) {
    return [
      '<tr class="sender-' + _.senderType + '">',
        '<td>' + _.sender + '</td>',
        '<td>' + _.event + '</td>',
        '<td>' + _.arg1 + '</td>',
        '<td>' + _.arg2 + '</td>',
        '<td>' + _.arg3 + '</td>',
      '</tr>'
    ].join('');
  };

  socket.on('message', function(message) {
    var html = template(message);
    log.innerHTML += html;
    document.body.scrollTop = log.scrollHeight;
  });

  socket.on('reset', function () {
    log.innerHTML = '';
  });

  socket.on('group', function (name) {
    log.innerHTML += [
      '<tr class="group">',
        '<td colspan="5">' + name + '</td>',
      '</tr>'
    ].join('');
  });

}());
