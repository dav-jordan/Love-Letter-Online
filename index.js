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

	if(Object.keys(io.sockets.sockets).length === 1) {
		socket.emit('host', { message: "You're the host!" });
	}

	// Removes players who disconnect from the game
	/*
	socket.on('disconnect', () => {
		if(game !== undefined) {
			console.log('\n\nDisconnecting socket' , socket.id);
			game.removePlayer(socket.id);
			console.log('Players: ' , game.players);
		}
	});
	*/

	// Creates instance of the game and asks all players for their Handle
	socket.on('lockPlayers', (data) => {
		game = new Game();

		io.sockets.emit('players', {});
	});

	// Creates the player based on their Socket ID and Handle
	socket.on('addPlayer', (data) => {
		if(game !== undefined) {
			// Create the player
			console.log('\nAdding player...');
			game.addPlayer(socket.id, data.handle);	

			// Gets the player object and gives it to that user
			let thisPlayer = game.getPlayer(socket.id);
			socket.emit('yourPlayer', { player: thisPlayer });
		}

		console.log('\nPlayers: ' , game.players);
	});

	// Randomly selects a Player to start the game
	socket.on('gameStart', (data) => {
		// Get all sockets connected
		let sockets = Object.keys(io.sockets.sockets);	
		
		for(let i = 0; i < sockets.length; i++) {
			// Draws a card for that player
			game.draw(sockets[i]);
		
			// Gets the player object and gives it to that user
			let thisPlayer = game.getPlayer(sockets[i]);

			// Get socket and emit
			let currSocket = io.sockets.sockets[sockets[i]];
			currSocket.emit('yourPlayer', { player: thisPlayer });
		}

		let nextPlayer = game.switchTurns();
		io.sockets.emit('newTurn', { currPlayer: nextPlayer.getHidden() });
	});

	// When that player starts their turn they draw a card
	// TODO optimize with game start
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
		
		if(game.checkEnd()){
			console.log("Game Over");
			io.sockets.emit('gameOver', {});
			return;	
		}

		let discardPile = game.discard;
		io.sockets.emit('discardUpdate', { discardPile: discardPile });

		let nextPlayer = game.switchTurns();
		io.sockets.emit('newTurn', { currPlayer: nextPlayer.getHidden() });
	});
});
