var moveAmount = 5;
var moveTime = 100;
var server = "http://192.168.1.6:3000"                      // needs to come server selection
connection = new Connection(server);
connection.setID();
function Player(location,user,direction,color,id){
  this.location =location;
  this.user=user;
  this.direction=direction;
  this.color=color;
  this.id=id;
  this.out = false;
}



$(document).ready(function(){
  var players = [];
//  var playerX = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
//  var playerY = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
    var playerX =250;
    var playerY = 250;
  var userBox = new Player([playerX,playerY],true,"up","red",connection.id);
  $('#board').css("top",Number($('#board').css("top").slice(0,-2)) -(playerY -200) + "px");
  $('#board').css("left",Number($('#board').css("left").slice(0,-2)) - (playerX-200) + "px");
  connection.socket.emit('addPlayer',userBox);
  players.push(userBox);
  var canvas = document.getElementById("canvas");
  canvas.width = $("#surface").width();
  canvas.height = $("#surface").height();
  $('#starter').click(function(){
    connection.socket.emit('start',{});
  })
  function initialize(){

    var ctx=canvas.getContext("2d");
    ctx.rect(1,1,1000,1000);
    ctx.stroke();
    draw();
    window.setInterval(function(){
       tick();
    }, moveTime);
  };

  $(document).keydown(function(e) {
      e.preventDefault();
    var newDirection = "";
    switch(e.which) {

        case 37: // left
        newDirection = "left";
        break;

        case 38: // up
        newDirection = "up";
        break;

        case 39: // right
        newDirection = "right";
        break;

        case 40: // down
        newDirection = "down";
        break;


        default: return; // exit this handler for other keys
    }
    for (var i = 0; i<players.length;i++){
      if(players[i].user == true) players[i].direction = newDirection;
    }
});
  function tick(){
    for (var i = 0;i<players.length;i++){
      if(!players[i].out){
      if (players[i].direction == "up"){
        players[i].location[1] -=moveAmount;
        if (players[i].user) $('#board').css("top",Number($('#board').css("top").slice(0,-2))+moveAmount + "px");
      }else if (players[i].direction == "down") {
        players[i].location[1] +=moveAmount;
        if (players[i].user) $('#board').css("top",Number($('#board').css("top").slice(0,-2))-moveAmount + "px");

      }else if (players[i].direction == "left") {
        players[i].location[0] -= moveAmount;
        if (players[i].user) $('#board').css("left",Number($('#board').css("left").slice(0,-2))+moveAmount + "px");

      }else{
        players[i].location[0] +=moveAmount;
        if (players[i].user) $('#board').css("left",Number($('#board').css("left").slice(0,-2))-moveAmount + "px");

      }
        if (players[i].user){
          var sendDirection = players[i].direction;
          var sendID = players[i].id;
          connection.socket.emit('locationUpdate',{sendDirection,sendID})
        }
      }
    }
    checkCollision();
    draw();


  }
  function checkPixels(x,y,x1,y1){
      var ctx=canvas.getContext("2d");
    var data = ctx.getImageData(x, y, 1, 1).data;
    var data2 = ctx.getImageData(x1, y1, 1, 1).data;
    for (var i =0;i<3;i++){
    if (data[i]>0 || data2[i]>0) return true;
  }
  }
  function checkCollision(){
    var ctx=canvas.getContext("2d");
    for (var i = 0; i < players.length; i ++){
      var tlX = players[i].location[0];
      var tlY = players[i].location[1];

      var trX = players[i].location[0] + 10;
      var trY = players[i].location[1];

      var blX = players[i].location[0];
      var blY = players[i].location[1] + 10;

      var brX = players[i].location[0] + 10;
      var brY = players[i].location[1] + 10;
      if (players[i].direction == "up"){
        if(checkPixels(tlX,tlY,trX,trY)){
          playerOut(i);
        }
      }else if (players[i].direction == "right"){
          if(checkPixels(trX,trY,brX,brY)){
            playerOut(i);
          }
        }else if (players[i].direction == "down"){
            if(checkPixels(brX,brY,blX,blY)){
              playerOut(i);
            }
        }else if (players[i].direction == "left"){
            if(checkPixels(blX,blY,tlX,tlY)){
              playerOut(i);
            }
        }

    }
  }
  function playerOut(playerNumber){
     players[playerNumber].out = true;
     connection.socket.emit('out',playerNumber);
  }
  function draw(){
    var ctx=canvas.getContext("2d");

    for (var i = 0;i<players.length;i++){
      ctx.fillStyle = players[i].color;
      ctx.fillRect(players[i].location[0],players[i].location[1],10,10);
    }

  }

connection.socket.on('start', function(data) {
console.log(data);
  for (var i = 0; i< data.length;i++){
    if (data[i].id != connection.id){
    data[i].user = false;
    console.log(data[i])
    players.push(data[i]);
  }
  }
  initialize();
});
connection.socket.on('playerAdded',function(data){
  serverPlayers = data.length;
  $('.serverPlayers').text(serverPlayers);
})

connection.socket.on('directionSet',function(data){
  console.log(data);
  for (var i = 0;i<players.length;i++){
    if (!players[i].user){
      players[i].direction = data[players[i].id]
    }
  }
})
})
