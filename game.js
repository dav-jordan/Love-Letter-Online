var Player = require('./player');

class Gamestate {
	constructor() {
		// Initiale variables
		this.players = {};
		this.activePlayer = -1;
		this.cards = ["Guard", "Guard", "Guard", "Guard", "Guard",
			"Priest", "Priest", "Baron", "Baron", 
			"Handmaid", "Handmaid", "Prince", "Prince",
			"King", "Countess", "Princess"];
		this.discard = [];

	}

	// Player methods
	get players() {
		return this._players;
	}

	set players(value) {
		this._players = value;
	}

	addPlayer(socket, handle) {
		if(Object.keys(this.players).length < 4) {
			// TODO remove this test
			let testId = Object.keys(this.players).length;
			this.players[socket] = new Player(socket, handle, [], "in");
			
			return true;
		}
		return false;
	}

	removePlayer(socket) {
		delete this.players[socket];
	}

	getPlayer(socket) {
		return this.players[socket];
	}

	// Activer player methods
	get activePlayer() {
		return this._activePlayer;
	}

	set activePlayer(value) {
		this._activePlayer = value;
	}

	currActivePlayer() {
		// Check how many players are still in the game
		let inPlayers = 0;
		for (var key in this.players) {
			if(this.players[key].state !== "out")
				inPlayers++;
		}

		// If there are 0 or 1 players remaining 
		// or there is no active player (i.e. that game has not started),
		// the round is over
		if(inPlayers < 2 || this.activePlayer === -1)
			return undefined;

		// Find the currently active player
		let count = 0;
		for (var key in this.players) {
			if(count === this.activePlayer) {
				if(this.players[key].state !== "out")
					// If that player is not out, return them
					return this.players[key];
				else {
					// If the player is out, switch turns, recursing this method
					return this.switchTurns;	
				}
			}
			count++;
		}
	}

	switchTurns() {
		let numPlayers = Object.keys(this.players).length;

		if (numPlayers < 2) {
			this._activePlayers = -1;
		} else if(this._activePlayer === -1) {
			this._activePlayer = Math.floor(Math.random() * numPlayers);
		} else {
			this._activePlayer = (this._activePlayer + 1) % numPlayers;
		}

		return this.currActivePlayer();
	}

	// Card methods
	get cards() {
		return this._cards;
	}

	set cards(value) {
		this._cards = value;
	}

	cardsInDeck() {
		return cards.length;
	}

	draw(socket) {
		if(this.cards.length > 0) {
			// Select card
			let cardNum = Math.floor(Math.random() * this.cards.length);

			// Get card value
			let ret = this.cards[cardNum];

			// Assign card to player
			let player = this.getPlayer(socket);
			player.drawCard(ret);

			// Remove from array
			this.cards.splice(cardNum, 1);

			return ret;
		}
	}

	playCard(playerSocket, targetSocket, card, parameter) {
		console.log('Player:' , playerSocket);
		console.log('Target:' , targetSocket);
		console.log('Card:' , card);
		console.log('Param:' , parameter);

		let playerCards = this.getPlayer(playerSocket).cards;
		console.log('Player\'s cards:' , playerCards);

	
		// remove cards from hand
		this.getPlayer(playerSocket).discardCard(card);

		// TODO Add card event handling

		console.log(`${playerSocket} played the ${card} card!`);

		console.log(typeof(targetSocket));

		console.log(Object.keys(this.players));
		console.log(this.players[`${targetSocket}`]);
		
		if(card === "Guard"){
			var target = this.players[`{${targetSocket}`];
			if(target._cards.includes(parameter)){
				console.log(`PLAYER ${playerSocket} GUESSED RIGHT!`);
			}
		}
		
		// remove cards from hand and add to discard
		this.getPlayer(playerSocket).discardCard(card);
		
		this.addToDiscard(card);
	}

	// Discard methods
	get discard() {
		return this._discard;
	}

	set discard(value) {
		this._discard = value;
	}

	addToDiscard(card) {
		this.discard.push(card);
	}
}


module.exports = Gamestate;
