var serverURL = 'http://localhost:3000'
var socket = io.connect(serverURL);
socket.emit('connection',{user:"test"})
