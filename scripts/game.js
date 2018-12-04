var playerCard;
var opponents = [
  "<img src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\" />",
  "<img src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\" />",
  "<img src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\" />"
]

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
  playerCard =
    "<img src=\"images/cards/guard.jpg\" width=\"150\" height=\"200\"alt=\"card\" />";
  document.getElementById("playerCards").innerHTML = playerCard;
}

function update() {
  opponentCards();
  playerCards();

  //update every two seconds
  setTimeout(update, 2000);
}
