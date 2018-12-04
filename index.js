// Initialize packages
var Express = require('express');
var HTTP = require('http');
var IO = require('socket.io');
var Game = require('./game');

// Initialize package objects
var app = Express();
var http = HTTP.Server(app);
var io = IO(http);
let game = new Game();


// Statically serve files
app.use('/', Express.static('game'));


app.get('/', (req, res) => {
	res.send('<h1>Hello world<h/1>');
}); 


// Check if PORT was predefined on system
let PORT = process.env.PORT|80;

// Listen to requests
http.listen(PORT, () => {
	console.log("Listening on " + PORT + "...");
});

io.on('connection', (socket) => {
	console.log('\n\nConnection initiated with socket' , socket.id);
	game.addPlayer(socket.id, "Test");
	console.log('Players: ' , game.players);

	socket.on('disconnect', () => {
		console.log('\n\nDisconnecting socket' , socket.id);
		game.removePlayer(socket.id);
		console.log('Players: ' , game.players);
	});

	socket.on('test', (data) => {
		console.log('\nData: ' , data);
	});

	socket.on('cardPlayed', (data) => {
		let players = game.players;
		let targetSocket = '';

		let count = 0
		for (var key in players) {
			console.log('Checking' , count , 'to' , data.target);
			if(count == data.target){
				targetSocket = key;
				break;
			}
		}

		game.playCard(socket.id, data.target, data.card, data.param);
		// TODO Invalid action handling

		let nextPlayer = game.switchTurns();
		io.sockets.emit('newTurn', { currPlayer: nextPlayer});
		
	});
});
