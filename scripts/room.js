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
  setTimeout(getPlayers, 3000);
}

async function readyClicked() {
  console.log("waiting for match to start");
  let result = await waitForRoom();
  console.log("result");
}
