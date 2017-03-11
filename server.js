var request = require('request');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  socket.on('locationUpdate', function(data) {
    console.log(data);
  })
  socket.on('connection', function(data) {
    console.log(data);
  })
})

server.listen(3000);
