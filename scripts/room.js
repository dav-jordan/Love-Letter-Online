function waitForRoom() {
  //this function will await a response from the server indicating that
  //the match is beginning
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve("resolved");
    }, 2000)
  });
}

function getPlayers() {
  console.log("getting players in lobby");
  let players = ["grr", "wires", "rego"];

  //update html with player list
  let html = "<fieldset class=\"players\">";
  html += "<h3>Players in lobby</h3>";
  for (var i = 0; i < 3; i++)
    html += "<h4>" + players[i] + "</h4>";
  html += "</fieldset>";
  document.getElementById("PlayersList").innerHTML = html;

  setTimeout(getPlayers, 3000);
}

async function readyClicked() {
  console.log("waiting for match to start");
  let result = await waitForRoom();
  console.log("result");
}
