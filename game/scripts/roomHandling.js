function test(str) {
  console.log("response received")
  console.log(str);
}

function joinRoom() {
  let username = document.getElementById("username").value;
  let lobby = document.getElementById("lobby").value;
  if(username.length == 0 || lobby.length == 0) {
    alert("Username and Room cannot be empty");
    return;
  }
  console.log("username: " + username);
  console.log("joining room " + lobby);
  //send command to server
  sendCommand("gameStart", {});
  sendCommand("addPlayer", {handle: username});
  listen("players", test);
  // window.location.href = "lobby.html?room=" + lobby;
}

function createRoom() {
  let username = document.getElementById("username").value;
  let lobby = document.getElementById("lobby").value;
  if(username.length == 0 || lobby.length == 0) {
    alert("Username and Room cannot be empty");
    return;
  }
  console.log("username: " + username);
  console.log("creating room " + lobby);
  window.location.href = "lobby.html?room=" + lobby;
}
