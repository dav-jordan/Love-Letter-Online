
class HiddenPlayer {
	constructor(player, handle, numCards, state) {
		if(player !== undefined) {
			this.handle = player.handle;
			this.numCards = player.numOfCards();
			this.state = player.state;
		} else {
			this.handle = handle;
			this.cardNum = cardNum;
			this.state = state;
		}
	}

	// handle methods
	get handle() {
		return this._handle;
	}
	
	set handle(value) {
		this._handle = value;
	}

	// numCards methods
	get numCards() {
		return this._numCards;
	}

	set numCards(value) {
		this._numCards = value;
	}

	// state methods
	get state() {
		return this._state;
	}

	set state(value) {
		this._state = value;
	}
}

module.exports = HiddenPlayer;
