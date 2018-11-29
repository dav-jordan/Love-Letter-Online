function joinRoom() {
  let username = document.getElementById("username").value;
  let lobby = document.getElementById("lobby").value;
  console.log("username: " + username);
  console.log("joining room " + lobby);
  window.location.href = "lobby.html";
}

function createRoom() {
  let username = document.getElementById("username").value;
  let lobby = document.getElementById("lobby").value;
  console.log("username: " + username);
  console.log("creating room " + lobby);
  window.location.href = "lobby.html";
}
