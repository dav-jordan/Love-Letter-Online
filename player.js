let stateEnum = Object.freeze({1:"in", "invun":2, "out":3})


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
	
	drawCard(card) {
		this.cards.push(card);
	}

	discardCard(card) {
		let ind = this.cards.find((element) => {
			return element === card;
		});

		this.cards.splice(ind, 1);
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
}

module.exports = Player;