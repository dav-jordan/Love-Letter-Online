function test(str) {
  console.log("response received")
  console.log(str);
}

function joinRoom() {
  //send command to server
  window.location.href = "lobby.html";
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
