//this file makes the server socket available to all files
var serverSocket = io();

//starts socket
function start() {
}

//emits command to server
function sendCommand(command, data) {
  if(serverSocket == undefined)
    start();
  serverSocket.emit(command, data);
}

//listens for command
function listen(response, then) {
  serverSocket.on(response, (data) => {
    console.log("response received");
    then(data);
  })
}
