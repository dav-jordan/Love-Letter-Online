var playerCard;
var opponents = [
  "<div></div>",
  "<div></div>",
  "<div></div>"
]

function opponentCards() {
  console.log("displaying opponent cards");
  for(var i = 0; i < 3; i++) {
    opponents[i] =
      "<img src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\" />"
  }
  document.getElementById("opponentCards").innerHTML =
    opponents[0] + "<br />"
    + opponents[1] + "<br />"
    + opponents[2] + "<br />";
}

function playerCard() {
  console.log("displaying player card");
  playerCard =
    "<img src=\"images/cards/guard.jpg\" width=\"150\" height=\"200\"alt=\"card\" />";
  document.getElementById("playerCards").innerHTML = playerCard;
}
