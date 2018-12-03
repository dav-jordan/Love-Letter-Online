class round{
	// constructors(JSON players, int rounds)
	constructor(id, players, rounds){
		this.id = id;
		this.players = players;
		this.rounds = rounds;
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

	get rounds(){
		return this._players;
	}
	set rounds(value){
		this._rounds = value
	}
}