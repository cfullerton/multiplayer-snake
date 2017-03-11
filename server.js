var request = require('request');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var locationData = {};
var players = [];
io.sockets.on('connection', function(socket) {
  console.log(socket)
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
    socket.playerID = data;

  })
  socket.on('disconnect', function() {
    console.log(socket.playerID);
    for (var i = 0; i <players.length;i++){
      if (players[i].id == socket.playerID){
        players.splice(i, 1);
      }
    }
    delete locationData[socket.playerID];
  })
  socket.on('start',function() {
    io.sockets.emit('start', players);
  })
})

server.listen(3000);
