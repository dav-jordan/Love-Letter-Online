var playerCard = "<img id=\"pCard1\" src=\"images/cards/guard.jpg\" width=\"150\" height=\"200\"alt=\"card\" />";
var opponentTemplate = "<input type=\"image\" src=\"images/cards/face-down.jpeg\" width=\"150\" height=\"200\"alt=\"card\"";
var takeInput = false;
var opponents = [
  "<div />",
  "<div />",
  "<div />"
]
var takingTurn = false;
var turn = true;
var user = sessionStorage.getItem("user");
var discard;

function opponentCards() {
  // console.log("displaying opponent cards");
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
  // console.log("displaying player card");
  //retrieve player card from server
  document.getElementById("playerCards").innerHTML = playerCard;
}

function playersTurn(data) {
  console.log(data);
  //set takingTurn to true to prevent update
  takingTurn = true;

  //draw another card
  if(data.player._cards[1] != undefined) {
    let nCard = "<input id=\"pCard2\" onclick=\"discard2()\" type=\"image\" src=\"images/cards/" + data.player._cards[1].toLowerCase() + ".jpg\" width=\"150\" height=\"200\"alt=\"card\" />";
    playerCard =  "<input id=\"pCard1\"  onclick=\"discard1()\" type=\"image\" src=\""
    + document.getElementById("pCard1").src + "\" width=\"150\" height=\"200\"alt=\"card\" />"
    + nCard;
  }

  document.getElementById("playerCards").innerHTML = playerCard;
  turn = true;
}

function takeTurn(data) {
  console.log(data);
  if(data.currPlayer._handle !== user) {
    listen("outcome", function(data) {
      console.log(data);
      document.getElementById("info").innerText = data.outcome;
      update();
    })
    return;
  }
  console.log("this player's turn");

  listen("info", function(data) {
    console.log(data);
    alert("They have " + data.info + "!");
  });

  if(turn) {
    turn = false;
    sendCommand("turnStart", {});
    listen("yourPlayer", function(data) {
      playersTurn(data);
    });
  }
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
  // update();
}

function getPlayers() {
  // console.log("getting");
  sendCommand("getPlayers", {});
  listen("playerList", function(data) {
    console.log(data);
    for(var i = 0; i < data.players.length; i++) {
      if(user === data.players[i]._handle)
        continue;
      opponents[i] = "<div>" + opponentTemplate + " id=\"opp" + i + "\" onclick=\"target" + i + "()\" />"
        + "<h3 id=\"opp" + i + "Name\">" + data.players[i]._handle + "</h3></div>";
    }
    opponentCards();
  })
  // setTimeout(getPlayers, 2000);
}

function begin() {
  sendCommand("gameStart", {});
  listen("yourPlayer", function(data) {
    // console.log(data.player._cards);
    playerCard = "<img id=\"pCard1\" src=\"images/cards/" + data.player._cards[0].toLowerCase()
      + ".jpg\" width=\"150\" height=\"200\"alt=\"card\" />";
    playerCards();
  })
  console.log("we here");
}

function host(data) {
  // console.log(data);
  // getPlayers();
  if(data.isHost) {
    var card;
    playerCard = "<button onclick=\"begin()\">Begin Match</button>";
    playerCards();
  } else {
    playerCard = "";
    playerCards();
    // listen("yourPlayer", function(data) {
    //   console.log(data);
    // });
    listen("yourPlayer", function(data) {
      console.log(data.player);

      playerCard = "<img id=\"pCard1\" src=\"images/cards/" + data.player._cards[0].toLowerCase()
        + ".jpg\" width=\"150\" height=\"200\"alt=\"card\" />";
      playerCards();
    });
  }
  update();
}

function start() {
  sendCommand("lockPlayers", {});
  // console.log(user);
  listen("players", function(data) {
    sendCommand("addPlayer", {handle: user});
    serverSocket.on("host", (data) => {
      // console.log("response received");
      host(data);
    })
  });
  // update();
}

function discard1() {
  // console.log("discarding 1");
  let card1 = document.getElementById("pCard1").src;
  discard = card1;
  if(!(card1.includes("handmaid") || card1.includes("princess") || card1.includes("countess"))) {
    console.log("target required");
    takeInput = true;
    getPlayers();
  } else {
    console.log("no target required");
    // update();
    let c = discard.split("").reverse().join("")
    c = c.substring(4, c.indexOf("/"));
    c = c.split("").reverse().join("");
    c = c.charAt(0).toUpperCase() + c.slice(1);
    sendCommand("cardPlayed", {target: undefined, card: c, param: ""});
  }
  playerCard =
  "<img  id=\"pCard1\" src=\"" + document.getElementById("pCard2").src + "\" "
  + "width=\"150\" height=\"200\"alt=\"card\" />";
  takingTurn = false;
   update();
  // setTimeout(discard1, 2000);
}
function discard2() {
  // console.log("discarding 2");
  let card2 = document.getElementById("pCard2").src;
  discard = card2;
  if(!(card2.includes("handmaid") || card2.includes("princess") || card2.includes("countess"))) {
    console.log("target required");
    takeInput = true;
    getPlayers();
  } else {
    console.log("no target required");
    let c = discard.split("").reverse().join("")
    c = c.substring(4, c.indexOf("/"));
    c = c.split("").reverse().join("");
    c = c.charAt(0).toUpperCase() + c.slice(1);
    sendCommand("cardPlayed", {target: undefined, card: c, param: undefined});
    update();
  }
  playerCard =
  "<img  id=\"pCard1\" src=\"" + document.getElementById("pCard1").src + "\" "
  + "width=\"150\" height=\"200\"alt=\"card\" />";
  takingTurn = false;
  // setTimeout(discard2, 2000);
}

function target0() {
  let c = discard.split("").reverse().join("")
  c = c.substring(4, c.indexOf("/"));
  c = c.split("").reverse().join("");
  c = c.charAt(0).toUpperCase() + c.slice(1);
  console.log(c);

  var guess;
  if(c === "Guard") {
    guess = prompt("What is your guess? (Handmaid, Priest, Princess, Baron, King, Countess, Prince)");
    while(guess === "Guard") {
      alert("Cannot guess guard!");
      guess = prompt("What is your guess? (Handmaid, Priest, Princess, Baron, King, Countess, Prince)");
    }
  }
  var t = document.getElementById("opp0Name").innerText;
  // console.log(t);
  sendCommand("cardPlayed", {target: t, card: c, param: guess});
  listen("discardUpdate", function(data) {
    console.log(data);
  });
  update();
}

function target1() {
  let c = discard.split("").reverse().join("")
  c = c.substring(4, c.indexOf("/"));
  c = c.split("").reverse().join("");
  c = c.charAt(0).toUpperCase() + c.slice(1);
  console.log(c);

  var guess;
  if(c === "Guard") {
    guess = prompt("What is your guess? (Handmaid, Priest, Princess, Baron, King, Countess, Prince)");
    while(guess === "Guard") {
      alert("Cannot guess guard!");
      guess = prompt("What is your guess? (Handmaid, Priest, Princess, Baron, King, Countess, Prince)");
    }
  }
  var t = document.getElementById("opp1Name").innerText;
  console.log(t);
  sendCommand("cardPlayed", {target: t, card: c, param: guess});
  listen("discardUpdate", function(data) {
    console.log(data);
  });
  update();
}

function target2() {

}
