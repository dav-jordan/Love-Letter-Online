function waitForRoom() {
  //this function will await a response from the server indicating that
  //the match is beginning
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve("resolved");
    }, 2000)
  });
}

function promptforUser() {
  console.log("prompting");
  alert("Game is starting!");
  let user = prompt("Enter a username:");
  sessionStorage.setItem("user", user);
  window.location.href = "game.html";
}


function readyClicked() {
  //waits for result of waitForRoom to continue
  console.log("waiting for match to start");
  promptforUser();
  // listen("players", promptforUser);
  console.log("result");
}

function prepare() {
  listen("players", promptforUser);
}
