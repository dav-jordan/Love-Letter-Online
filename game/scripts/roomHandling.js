function joinRoom() {
  let username = document.getElementById("username").value;
  let lobby = document.getElementById("lobby").value;
  if(username.length == 0 || lobby.length == 0) {
    alert("Username and Room cannot be empty");
    return;
  }
  console.log("username: " + username);
  console.log("joining room " + lobby);
  window.location.href = "lobby.html?room=" + lobby;
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
