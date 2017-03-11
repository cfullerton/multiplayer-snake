var request = require('request');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var locationData = {};
var players = [];
io.sockets.on('connection', function(socket) {
  socket.on('locationUpdate', function(data) {
    if (!locationData[data.sendID] || !(locationData[data.sendID] == data.sendDirection)){
    locationData[data.sendID]= data.sendDirection;
    io.sockets.emit('directionSet', locationData);
  }
  })
 socket.on('addPlayer',function(data){
   players.push(data);
 })
  socket.on('idRegister', function(data) {     // needs to validate that no two are the same
    console.log(data);

  })
  socket.on('start',function() {
    io.sockets.emit('start', players);
  })
})

server.listen(3000);
