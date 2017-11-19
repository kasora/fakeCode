var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  io.emit('chat message', 'someone is join in...');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnecting', function(msg){
    io.emit('chat message', 'someone is leaving...');
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});