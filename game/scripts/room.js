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

  //store in session Storage
  let json = JSON.stringify(players);
  console.log(json);
  sessionStorage.setItem("opponents", json);

  //update html with player list
  let html = "<fieldset class=\"players\">";
  html += "<h3>Players in lobby</h3>";
  for (var i = 0; i < 3; i++)
    html += "<h4>" + players[i] + "</h4>";
  html += "</fieldset>";
  document.getElementById("PlayersList").innerHTML = html;

  //recursively call function to update when more players added
  setTimeout(getPlayers, 3000);
}

async function readyClicked() {
  //waits for result of waitForRoom to continue
  console.log("waiting for match to start");
  let result = await waitForRoom();
  console.log("result");
}
