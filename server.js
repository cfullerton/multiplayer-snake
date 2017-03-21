var request = require('request');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var locationData = {};
var players = [];
var connections = [];
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
    socket.playerID = data;
    connections.push(data);
    io.sockets.emit('playerAdded', connections);
  })
  socket.on('out', function(data) {     // needs to do something with player out event
      io.sockets.emit('playerOut',data);
      for(var i = 0;i<players.length;i++){
        if(players[i].id == data){
          players[i].out = true;
        }
      }

  })
  socket.on('disconnect', function() {
    console.log(socket.playerID);
    for (var i = 0; i <players.length;i++){
      if (players[i].id == socket.playerID){
        players.splice(i, 1);
      }
    }
    for (var i = 0; i <connections.length;i++){
      if (connections[i] == socket.playerID){
        connections.splice(i, 1);
      }
    }
    delete locationData[socket.playerID];
    io.sockets.emit('playerAdded', connections);
  })
  socket.on('start',function() {
    io.sockets.emit('start', players);
    for(var i = 0;i<players.length;i++){
      players[i].out = false;
    }
  })
})

server.listen(3000);
