class instance{
	// constructors(JSON players, int rounds)
	constructor(players, rounds){
		this.players = players;
		this.rounds = rounds;
	}

	get players(){
		return this._players;
	}
	set players(value){
		this._players = value;
	}

	get rounds(){
		return this._players;
	}
	set rounds(value){
		this._rounds = value
	}
}