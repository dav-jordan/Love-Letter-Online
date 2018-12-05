var HiddenPlayer = require('./hiddenPlayer');

class Player {
	constructor(socket, handle, cards, state) {
		this.socket = socket;
		this.handle = handle;
		this.cards = cards;
		this.state = state;
	}

	// Socket methods
	get socket() {
		return this._socket;
	}

	set socket(value) {
		this._socket = value;
	}

	// Handle methods
	get handle() {
		return this._handle;
	}

	set handle(value) {
		this._handle = value;
	}

	// Cards methods
	get cards() {
		return this._cards;
	}

	set cards(value) {
		this._cards = value;
	}

	// Get number of cards in hand
	numOfCards() {
		return this.cards.length;
	}
	
	// Add a card to hand
	drawCard(card) {
		this.cards.push(card);
	}

	// Remove a card from hand
	discardCard(card) {
		let ind = this.cards.indexOf(card);
		console.log("CARD IS AT " + ind);
		if(ind == -1){
			return ind;
		}
		this.cards.splice(ind, 1);
		return ind;
	}

	// State methods
	get state() {
		return this._state;
	}

	set state(value) {
		if(value !== "in" && value !== "invun" && value !== "out")
			throw "Invalid Player State";
		else
			this._state = value;	
	}

	getHidden() {
		return new HiddenPlayer(this, undefined, undefined, undefined);
	}
}

module.exports = Player;
