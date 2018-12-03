var mysql = require('mysql');
var round = require('./round');

class loveConnector{
	constructor(){
		this.host = "luvletter.cnv0pqbpd5d5.us-east-2.rds.amazonaws.com";
		this.user = "ryanDB";
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
				connection.query("SELECT * FROM loveLetter.rounds", function(err, result, fields){
					if (err) throw err;
					//callback to end connection
					connection.end(function(err) {
						if (err) throw err;

						//Iterate through JSON object returned by SQL query and add new SnackPack objects to list_snackpacks
						var listRounds=[];
						for(var r in result){
							var roundTmp = result[r];
							listRounds.push(new round(roundTmp.id, roundTmp.players, roundTmp.numPlayers, roundTmp.numRounds));
						}
						resolve(listRounds);
					});
				});
			});
		});
	}

	// json
	createGame(players){
		return new Promise((resolve, reject) => {
			//callback to initiate connection to AWS RDS
			var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
			connection.connect(function(err) {
				if (err) throw err;
				//callback to send query
				connection.query("select * from loveLetter.rounds", function(err, count, fields){
					if(count.length > 0){
						connection.query(`SELECT id FROM loveLetter.rounds ORDER BY id DESC LIMIT 0, 1`, function(err, count_result, fields){
							var index = count_result[0].id + 1;
							console.log(index);
							if(err) reject(err); 
							var jsonString = JSON.stringify(players);
							connection.query((`INSERT INTO loveLetter.rounds VALUES(${index}, '${jsonString}', ${players.length}, 0)`), function(err, result, fields){
								if(err) reject(err);
								connection.end(function (err){
									console.log("success");
									if (err) reject(err);
									resolve(true);
								});
							});
						});
					}else{
						connection.query((`INSERT INTO loveLetter.rounds VALUES(0, '${players}', ${players.length}, 0)`), function(err, result, fields){
							if(err) reject(err);
							connection.end(function (err){
								console.log("success");
								if (err) reject(err);
								resolve(true);
							});
						});
					}
				});
			});
		});
	}

	// incrementRound(int instanceID, int winnerID)
	nextRound(instanceID, winnerID){
		return new Promise((resolve, reject) => {
			//callback to initiate connection to AWS RDS
			var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
			connection.connect(function(err) {
				if (err) throw err;
				//callback to send query
				connection.query(`select * from loveletter.rounds where id=${instanceID}`, function(err, count, fields){
					if(err) reject(err);
					if(count.length > 0){
						let roundNum = count[0].rounds + 1;
						connection.query((`update loveletter.rounds set rounds=${roundNum}`), function(err, result, fields){
							if(err) reject(err);
							connection.end(function (err){
								console.log("success");
								if (err) reject(err);
								resolve(true);
							});
						});
					}else{
						connection.end(function (err){
							if(err) reject(err);
							reject("ID NOT FOUND");
						});
					}
				});
			});
		});
	}	

	// addPlayer(string name)
	addPlayer(playerName){
		return new Promise((resolve, reject) => {
			//callback to initiate connection to AWS RDS
			var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
			connection.connect(function(err) {
				if (err) throw err;
				//callback to send query
				connection.query(`select * from loveLetter.rounds`, function(err, count, fields){
					if(err) reject(err);

					var gameJSON;
					var gameID;
					console.log(count);
					for(var x in count){
						if(count[x].numPlayers < 5){
							gameJSON = JSON.parse(count[x].players);
							// console.log(count[x].players);
							gameID = x;
							break;
						}
					}
					gameJSON.push({"id": gameJSON.length, "name": playerName, "wins":0});
					var jsonString = JSON.stringify(gameJSON);
					connection.query((`update loveLetter.rounds set players='${jsonString}' where id=${gameID}`), function(err, result, fields){
						if(err) reject(err);
						connection.end(function (err){
							console.log("success");
							if (err) reject(err);
							resolve(true);
						});
					});
				});
			});
		});
	}

}	

//Allows module to be exposed
module.exports = loveConnector;