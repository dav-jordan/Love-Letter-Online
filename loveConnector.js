var mysql = require('mysql');
var round = require('./round');

class loveConnector{
	constructor(){
		this.host = "loveletter.czkpljxaoadm.us-east-2.rds.amazonaws.com";
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
										listRounds.push(new round(roundTmp.it, roundTmp.players, roundTmp.numPlayers, roundTmp.numRounds));
										}
										resolve(listRounds);
										});
								});
						});
		});
	}

	getGameByID(val){
		return new Promise((resolve, reject) => {
				//callback to initiate connection to AWS RDS
				var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
				connection.connect(function(err) {
						if (err) throw err;
						//callback to send query
						connection.query(`SELECT * FROM loveLetter.rounds where it=${val}`, function(err, result, fields){
								if (err) throw err;
								//callback to end connection
								connection.end(function(err) {
										if (err) throw err;

										//Iterate through JSON object returned by SQL query and add new SnackPack objects to list_snackpacks
										var listRounds=[];
										for(var r in result){
										var roundTmp = result[r];
										listRounds.push(new round(roundTmp.it, roundTmp.players, roundTmp.numPlayers, roundTmp.numRounds));
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
								console.log(count.length);
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

								var jsonString = JSON.stringify(players);
								connection.query((`INSERT INTO loveLetter.rounds VALUES(0, '${jsonString}', ${players.length}, 0)`), function(err, result, fields){
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
						connection.query(`select * from loveLetter.rounds where it=${instanceID}`, function(err, count, fields){
								if(err) reject(err);
								if(count.length > 0){
								let roundNum = count[0].numRounds + 1;
								console.log(roundNum);
								var updateJSON = JSON.parse(count[0].players);
								console.log(updateJSON);
								for(var x in updateJSON){
								if(updateJSON[x].name === winnerID){
								updateJSON[x].wins++;
								break;
								}
								}
								var updateString = JSON.stringify(updateJSON);
								connection.query((`update loveLetter.rounds set numRounds=${roundNum}, players='${updateString}' where it=${instanceID}`), function(err, result, fields){
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
								connection.query((`update loveLetter.rounds set players='${jsonString}' where it=${gameID}`), function(err, result, fields){
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

	checkWinner(instanceID){
		return new Promise((resolve, reject) => {
				//callback to initiate connection to AWS RDS
				var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
				connection.connect(function(err) {
						if (err) throw err;
						//callback to send query
						connection.query(`select * from loveLetter.rounds where it=${instanceID}`, function(err, count, fields){
								if(err) reject(err);
								if(count.length > 0){
									connection.end(function (err){
										var updateJSON = JSON.parse(count[0].players);
										console.log(updateJSON);
										for(var x in updateJSON){
											if(updateJSON[x].wins == 5){
												resolve(updateJSON[x].name);
												break;
											}
										}
										// console.log("success");
										// if (err) reject(err);
										resolve(0);
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

}	

//Allows module to be exposed
module.exports = loveConnector;

