var moveAmount = 5;
var moveTime = 100;

function Player(location,user,direction,color,outside){
  this.location =location;
  this.user=user;
  this.direction=direction;
  this.color=color;
  this.outside=outside;
  this.trail=[];
}



$(document).ready(function(){
  var players = [];
  var canvas = document.getElementById("canvas");
  canvas.width = $("#board").width();
  canvas.height = $("#board").height();

  function initialize(){
    var userBox = new Player([200,200],true,"up","red",false);
    players.push(userBox);
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
    }
    checkCollision();
    draw();


  }
  function checkPixels(x,y,x1,y1){
      var ctx=canvas.getContext("2d");
    var data = ctx.getImageData(x, y, 1, 1).data;
    var data2 = ctx.getImageData(x1, y1, 1, 1).data;
    if (data[0]>0 || data2[0]>0) return true;
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
    delete players[playerNumber];
  }
  function draw(){
    var ctx=canvas.getContext("2d");

    for (var i = 0;i<players.length;i++){
      ctx.fillStyle = players[i].color;
      ctx.fillRect(players[i].location[0],players[i].location[1],10,10);
    }

  }


initialize();

})
