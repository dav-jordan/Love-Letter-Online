var Player = require('./player');

class Gamestate {
	constructor() {
		// Initiale variables
		this.players = {};
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
			//this.players[socket] = new Player(socket, handle, undefined, "in");
			this.players[socket] = new Player(socket, testId, ["Priest","Guard"], "in");
			return true;
		}
		console.log('Player length: ' , Object.keys(this.players).length);
		return false;
	}

	getPlayer(socket) {
		console.log('Corresponding Player:' , this.players[socket]);
		return this.players[socket];
	}

	// Card methods
	get cards() {
		return this._cards;
	}

	set cards(value) {
		this._cards = value;
	}

	draw(socket) {
		if(cards.length > 0) {
			// Select card
			let cardNum = Math.floor(Math.random() * this.cards.length);

			// Get card value
			let ret = this.cards[cardNum];

			// Assign card to player
			getPlayer(socket).cards.push(ret);

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

		let ind = playerCards.find((element) => {
			return element === card;
		});
		// remove cards from hand
		playerCards.splice(ind, 1);

		// TODO Add card event handling

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
