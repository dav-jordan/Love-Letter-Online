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
		if(this.players.length < 4) {
			let id = players.length();

			this.players[socket] = new Player(socket, handle, undefined, "in");
			return true;
		}
		return false;
	}

	getPlayer(socket) {
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
		let playerCards = getPlayer(socket).cards;
		
		let ind = playerCards.findInd(card);
		playerCards.splice(ind, 1);

		// TODO Add card event handling

		addToDiscard(card);
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
