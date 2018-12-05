var Player = require('./player');
var loveDB = require('./loveConnector');
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
		this.id;
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
			let loveConnector = new loveDB();
			loveConnector.addPlayer(handle).then(data => console.log(data)).catch(err => console.log(err));
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

	getSocket(handle) {
		for(var key in this.players) {
			if(this.players[key].handle === handle)
				return this.players[key];
		}

		return undefined;
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
				if(this.players[key].state !== "out"){
					// If that player is not out, return them
					return this.players[key];
				}else {
					// If the player is out, switch turns, recursing this method
					return this.switchTurns();
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

	getCardValue(card){
		switch(card){
			case "Guard":
				return 1;
			case "Priest":
				return 2;
			case "Baron":
				return 3;
			case "Handmaiden":
				return 4;
			case "Prince":
				return 5;
			case "King":
				return 6;
			case "Countess":
				return 7;
			case "Princess":
				return 8;
		}
	}

	playCard(playerSocket, targetSocket, card, parameter) {
		console.log('Player:' , playerSocket);
		console.log('Target:' , targetSocket);
		console.log('Card:' , card);
		console.log('Param:' , parameter);

		let ret = {};

		// Get the player
		let player = this.getPlayer(playerSocket);
		let playerCards = player.cards;
		console.log('Player\'s cards:' , playerCards);
		var target;
		// Check if target exists
		if(targetSocket !== undefined) {
			target = this.getPlayer(targetSocket);

			// Check if target is invun, if they are, return an error
			if(player.state === "invun" || player.state === "out"){
				console.log("Invalid target!");
				ret["error"] = "Invalid Target";
				return ret;
			}
		}

		// Discard the card
		console.log("\nDiscarding Card");
		let removeVal = player.discardCard(card);
		if(removeVal == -1){
			throw "Card Not Found";
		}

		// Set player state if invun
		if(player.state == "invun"){
			this.getPlayer(playerSocket).state = "in";
		}

		// console.log(this.players[targetSocket]);
		if(card == "Guard"){
			console.log("Played Guard");

			// Check if the targets card is the guessed card
			if(target.cards.includes(parameter)){
				ret['info'] = "Success";
				ret['outcome'] = player.handle + ' discarded a Guard. They successfully guessed that ' + target.handle + ' had a ' + parameter + '!';

				console.log("Guess Success");
				target.discardCard(parameter);
				target.state = "out";
				this.addToDiscard(parameter);
			} else {
				ret['outcome'] = player.handle + ' discarded a Guard. They failed to guess ' + target.handle + '\'s card!';
			}
		} else if(card === "Priest"){
			// Return info of card in hand
			ret['info'] = target.cards[0];
			ret['outcome'] = player.handle + ' discarded Priest, targeting ' + target.handle + '!';
		} else if(card === "Baron"){
			let targetHandVal = this.getCardValue(target.cards[0]);
			let thisHandVal = this.getCardValue(player.cards[0]);

			if(targetHandVal > thisHandVal) {
				this.addToDiscard(player.cards[0]);
				player.discardCard(player.cards[0]);
				player.status = "out";

				//ret['info'] = target.cards[0];
				ret['outcome'] = player.handle + ' discarded Baron, targeting ' + target.handle + '! And ' + player.handle + ' lost!';
			} else if(targetHandVal < thisHandVal){
				this.addToDiscard(target.cards[0]);
				target.discardCard(target.cards[0]);
				target.state = "out";

				//ret['info'] = target.cards[0];
				ret['outcome'] = player.handle + ' discarded Baron, target ' + target.handle + '! And ' + player.handle + ' won!';
			} else {
				//ret['info'] = target.cards[0];
				ret['outcome'] = player.handle + ' discarded Baron, target ' + target.handle + '! It\'s a tie!';
			}
		} else if(card === "Handmaid") {
			console.log("Handmaid");
			player.state = "invun";

			ret['outcome'] = player.handle + ' discarded Handmaid, they are invunerable till next turn!';
		} else if(card === "Prince") {
			let discarded = target.cards[0];
			target.discardCard(discarded);
			if(discarded === "Princess"){
				target.state = "out";
			} else{
				this.draw(targetSocket);
			}
			ret['outcome'] = player.handle + ' discarded Prince, targeting ' + target.handle + '! They discarded a ' + discarded + '!';
		} else if(card === "King") {
			// Players Swap Hands
			var tmpCardList = target.cards;
			target.cards = player.cards;
			player.cards = tmpCardList;

			ret['outcome'] = player.handle + ' discarded King, switching hands with ' + target.handle + '!';
		} else if(card === "Countess") {
			ret['outcome'] = player.handle + ' discarded a Countess!';
		} else if(card === "Princess") {
			player.state = "out";

			ret['outcome'] = player.handle + ' discarded a Princess! They are out of the round!';
		}

		// Remove cards from hand and add to discard
		// this.getPlayer(playerSocket).discardCard(card);
		this.addToDiscard(card);
		console.log(this.players);

		return ret;
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
	checkEnd(){
		let loveConnector = new loveDB();
		if(this.cards.length == 0){
			var maxPlayer = null;
			for(var x in this.players){
				if(maxPlayer === null){
					maxPlayer = this.players[x];
					continue;
				}
				if(this.getCardValue(this.players[x].cards[0]) > this.getCardValue(maxPlayer.cards[0])){
					maxPlayer = this.players[x];
				}
			}
			console.log(maxPlayer.handle + " won");
			var scoreboard;
			loveConnector.nextRound(maxPlayer.handle);
			loveConnector.scoreboard()
				.then(data =>{
					var retList = [maxPlayer.handle, data];
					return retList;	
				})
				.catch(err => console.log(err));
		}
		let inCount = 0;
		let lastPlayer = null;
		for(var x in this.players){
			if(this.players[x].state !==  "out"){
				console.log(this.players[x].state);
				inCount++;
				lastPlayer = this.players[x];
			}
		}
		loveConnector.nextRound(lastPlayer.handle);
		if(inCount == 1){
			console.log("GAME OVER");
			return loveConnector.scoreboard();
		}
		return null;
	}
}


module.exports = Gamestate;
