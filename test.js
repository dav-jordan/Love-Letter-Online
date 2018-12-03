var loveDB = require('./loveConnect')

var loveConnector = new loveDB();
// loveConnector.getGames()
// 	.then(data => console.log(data))
// 	.catch(err => console.log(err));

// loveConnector.addPlayer("ryan")
// 	.then(data => console.log(data))
// 	.catch(err => console.log(err));

loveConnector.createGame([])
	.then(data => console.log(data))
	.catch(err => console.log(err));