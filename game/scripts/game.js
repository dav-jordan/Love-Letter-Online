var playerCard = "<img id=\"pCard1\" src=\"images/cards/guard.jpg\" width=\"150\" height=\"200\"alt=\"card\" />";
var opponents = [
  "<img src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\" />",
  "<img src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\" />",
  "<img src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\" />"
]
var takingTurn = false;

function opponentCards() {
  console.log("displaying opponent cards");
  // for(var i = 0; i < 3; i++) {
  //   opponents[i] =
  //     "<img src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\" />"
  // }

  //render opponent cards
  document.getElementById("opponentCards").innerHTML =
    opponents[0] + "<br /><br />"
    + opponents[1] + "<br /><br />"
    + opponents[2] + "<br /><br />";
}

function playerCards() {
  console.log("displaying player card");
  //retrieve player card from server
  document.getElementById("playerCards").innerHTML = playerCard;
}

function playersTurn() {
  //set takingTurn to true to prevent update
  takingTurn = true;

  //draw another card
  let nCard =
    "<input id=\"pCard2\" onclick=\"discard2()\" type=\"image\" src=\"images/cards/baron.jpg\" width=\"150\" height=\"200\"alt=\"card\" />";
  playerCard =
  "<input id=\"pCard1\"  onclick=\"discard1()\" type=\"image\" src=\""
  + document.getElementById("pCard1").src + "\" width=\"150\" height=\"200\"alt=\"card\" />"
  + nCard;

  document.getElementById("playerCards").innerHTML = playerCard;
}

function takeTurn(data) {
  console.log(data);
}

//updates state every 2 seconds
function update() {
  listen("newTurn", takeTurn);

  opponentCards();
  playerCards();

  console.log(takingTurn);
  if(takingTurn)
    return;
  //check if it is the player's turn
  // let playerTurn = true;
  // if(playerTurn){
  //   console.log("player");
  //   playersTurn();
  //   playerTurn = false;
  // } else {
  //   console.log("opponent");
  // }

  //update every two seconds
  // setTimeout(update, 2000);
}

function test(data) {
  console.log(data);
}

function start() {
  sendCommand("lockPlayers", {});
  let user = sessionStorage.getItem("user");
  console.log(user);
  listen("players", function(data) {
    sendCommand("addPlayer", {handle: user});
    listen("yourPlayer", test);
  });
  update();
}

function discard1() {
  console.log("discarding 1");
  playerCard =
  "<img  id=\"pCard1\" src=\"" + document.getElementById("pCard2").src + "\" "
  + "width=\"150\" height=\"200\"alt=\"card\" />";
  takingTurn = false;
  update();
  // setTimeout(discard1, 2000);
}
function discard2() {
  console.log("discarding 2");
  playerCard =
  "<img  id=\"pCard1\" src=\"" + document.getElementById("pCard1").src + "\" "
  + "width=\"150\" height=\"200\"alt=\"card\" />";
  takingTurn = false;
  update();
  // setTimeout(discard2, 2000);
}
