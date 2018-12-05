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
				if(this.players[key].state !== "out"){
					// If that player is not out, return them
					this.draw(key);
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

	draw(socket) {
		if(this.cards.length > 0) {
			// Select card
			let cardNum = Math.floor(Math.random() * this.cards.length);

			// Get card value
			let ret = this.cards[cardNum];

			// Assign card to player
			let player = this.getPlayer(socket);
			player.cards.push(ret);

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
		let playerCards = this.getPlayer(playerSocket).cards;
		console.log('Player\'s cards:' , playerCards);


		// remove cards from hand
		console.log("\n\nREMOVING CARD NOW");
		let removeVal = this.getPlayer(playerSocket).discardCard(card);
		if(removeVal == -1){
			//throw "CARD NOT FOUND";
			return;
		}
		console.log(this.getPlayer(playerSocket));

		// TODO Add card event handling

		// console.log(this.players[targetSocket]);
		if(card == "Guard"){
			console.log("Card is guard");
			var targetPlayer = this.getPlayer(targetSocket);
			if(targetPlayer.cards.includes(parameter)){
				console.log("Got em boi");
				targetPlayer.discardCard(parameter);
				targetPlayer.state = "out";
				this.addToDiscard(parameter);
			}
		}else if(card === "Baron"){
			console.log("Card is BARON");
			var targetPlayer = this.getPlayer(targetSocket);
			var thisPlayer = this.getPlayer(playerSocket);

			let targetHandVal = this.getCardValue(targetPlayer.cards[0]);
			let thisHandVal = this.getCardValue(thisPlayer.cards[0]);

			console.log(targetHandVal + "," + thisHandVal);

			if(targetHandVal > thisHandVal){
				console.log(thisPlayer.cards);
				this.addToDiscard(thisPlayer.cards[0]);
				thisPlayer.discardCard(thisPlayer.cards[0]);
				thisPlayer.status = "out";
			}else{
				this.addToDiscard(this.targetPlayer.cards[0]);
				targetPlayer.discardCard(targetPlayer.cards[0]);
				targetPlayer.status = "out";
			}
		}else if(card === "Handmaiden"){
			console.log("Card is Handmaiden");
			var thisPlayer = this.getPlayer(playerSocket);
			thisPlayer.state = "invun";
		}else if(card === "Prince"){
			var targetPlayer = this.getPlayer(targetSocket);
			var discarded = targetPlayer.cards[1];
			targetPlayer.discardCard(discarded);
			if(discarded === "Princess"){
				targetPlayer.status = "out";
			}else{
				this.draw(targetSocket);
			}
		}else if(card === "King"){
			var thisPlayer = this.getPlayer(playerSocket);
			var targetPlayer = this.getPlayer(targetSocket);

			// swap
			console.log("Initiating swap:\nplayer 1:" + targetPlayer.cards + "\nplayer 2:" + thisPlayer.cards + "\n");
			var tmpCardList = targetPlayer.cards;
			targetPlayer.cards = thisPlayer.cards;
			thisPlayer.cards = tmpCardList;

			console.log("Finished swap:\nplayer 1:" + targetPlayer.cards + "\nplayer 2:" + thisPlayer.cards + "\n");
		}else if(card === "Countess"){
		}else if(card === "Princess"){
			var thisPlayer = this.getPlayer(playerSocket);
			thisPlayer.state = "out";
		}

		//e remove cards from hand and add to discard
		// this.getPlayer(playerSocket).discardCard(card);
		this.addToDiscard(card);
		console.log(this.players);
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
			return true;
		}
		let inCount = 0;
		for(var x in this.players){
			if(this.players[x].state == "in") inCount++;			
		}
		if(inCount == 1) return true;
	}
}


module.exports = Gamestate;
