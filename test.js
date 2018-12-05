var loveDB = require('./loveConnector');

var loveConnector = new loveDB();

// loveConnector.checkWinner(null).then(data => console.log(data)).catch(err => console.log(err));

 //loveConnector.addPlayer("Ryan").then(data => console.log(data)).catch(err => console.log(err));

// loveConnector.nextRound("jay").then(data => console.log(data)).catch(err => console.log(err));

loveConnector.scoreboard().then(data => console.log(data)).catch(err => console.log(err));
