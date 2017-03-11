function Connection(serverURL){
this.socket = io.connect(serverURL),
this.socket.emit('connection',{user:"test"}),
this.setID = function (){
    var id = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
    this.socket.emit('idRegister',id);
    this.id = id;
  },
  this.id = 0;
}

var playerDirections = {}
