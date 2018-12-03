var mysql = require('mysql');

class loveConnector{
	constructor(){
		this.host = "snackpacksdb.cawigtgndeba.us-east-2.rds.amazonaws.com";
		this.user = "loveLetter";
		this.password = "gustavoisgod";
		this.port = 3306;
	}

	getGames(){
		return new Promise((resolve, reject) => {
			//callback to initiate connection to AWS RDS
			var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
			connection.connect(function(err) {
				if (err) throw err;
				//callback to send query
				connection.query("SELECT * FROM loveletter.rounds", function(err, result, fields){
					if (err) throw err;
					//callback to end connection
					connection.end(function(err) {
						if (err) throw err;

						//Iterate through JSON object returned by SQL query and add new SnackPack objects to list_snackpacks
						var listRounds=[];
						for(var r in result){
							var roundTmp = result[r];
							listRounds.push(new round(roundTmp.id, roundTmp.name, roundTmp.contents, roundTmp.allergens, roundTmp.image_path, roundTmp.reviews, roundTmp.cost));
						}
						resolve(listRounds);
					});
				});
			});
		});
	}

	createGame(players){
		return new Promise((resolve, reject) => {
			//callback to initiate connection to AWS RDS
			var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
			connection.connect(function(err) {
				if (err) throw err;
				//callback to send query
				connection.query("SELECT * FROM loveletter.rounds", function(err, result, fields){
					if (err) throw err;
					//callback to end connection
					connection.end(function(err) {
						if (err) throw err;

						//Iterate through JSON object returned by SQL query and add new SnackPack objects to list_snackpacks
						var listRounds=[];
						for(var r in result){
							var roundTmp = result[r];
							listRounds.push(new round(roundTmp.id, roundTmp.name, roundTmp.contents, roundTmp.allergens, roundTmp.image_path, roundTmp.reviews, roundTmp.cost));
						}
						resolve(listRounds);
					});
				});
			});
		});
	}

}	