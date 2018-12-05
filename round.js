class round{
	// constructors(JSON players, int rounds)
	constructor(id, players, numPlayers, numRounds){
		this.id = id;
		this.players = players;
		this.numPlayers = numPlayers;
		this.numRounds = numRounds;
	}

	get id(){
		return this._id;
	}
	set id(value){
		this._id = value;
	}

	get players(){
		return this._players;
	}
	set players(value){
		this._players = value;
	}

	get numRounds(){
		return this._numRouds;
	}
	set numRounds(value){
		this._numRounds = value
	}

	get numPlayers(){
		return this._numPlayers;
	}
	set numPlayers(value){
		this._numPlayers = value
	}
}

module.exports = round;
