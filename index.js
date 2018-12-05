// Initialize packages
var Express = require('express');
var HTTP = require('http');
var IO = require('socket.io');
var Game = require('./game');

// Initialize package objects
var app = Express();
var http = HTTP.Server(app);
var io = IO(http);
let game = undefined;


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

	socket.on('disconnect', () => {
		if(game !== undefined) {
			console.log('\n\nDisconnecting socket' , socket.id);
			game.removePlayer(socket.id);
			console.log('Players: ' , game.players);
		}
	});

	socket.on('gameStart', (data) => {
		game = new Game();

		io.sockets.emit('players', {});
	});

	socket.on('addPlayer', (data) => {
		if(game !== undefined) {
			console.log('Adding player...');
			game.addPlayer(socket.id, data.handle);	

			game.draw(socket.id);
		}

		console.log('\nPlayers: ' , game.players);

		let thisPlayer = game.getPlayer(socket.id);
		socket.emit('yourPlayer', { player: thisPlayer });
		

		let nextPlayer = game.switchTurns();
		io.sockets.emit('newTurn', { currPlayer: nextPlayer });
	});

	socket.on('turnStart', (data) => {
		if(game !== undefined) {
			game.draw(socket.id);
		}
	});

	socket.on('cardPlayed', (data) => {
		let players = game.players;
		let targetSocket = '';

		let count = 0
		for (var key in players) {
			console.log('\n\nChecking' , count , 'to' , data.target);
			if(count == data.target){
				targetSocket = key;
				break;
			}
		}

		game.playCard(socket.id, data.target, data.card, data.param);
		// TODO Invalid action handling

		let nextPlayer = game.switchTurns();
		console.log("Next player: " + nextPlayer);
		io.sockets.emit('newTurn', { currPlayer: nextPlayer});
		
	});
});
