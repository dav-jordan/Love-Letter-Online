var mysql = require('mysql');
var round = require('./round');

class loveConnector{
	constructor(){
		this.host = "loveletter.czkpljxaoadm.us-east-2.rds.amazonaws.com";
		this.user = "ryanDB";
		this.password = "gustavoisgod";
		this.port = 3306;
	}

	scoreboard(){
		return new Promise((resolve, reject) => {
				//callback to initiate connection to AWS RDS
				var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
				connection.connect(function(err) {
						if (err) throw err;
						//callback to send query
						connection.query("SELECT * FROM loveLetter.users", function(err, result, fields){
								if (err) throw err;
								//callback to end connection
								connection.end(function(err) {
										if (err) throw err;

										//Iterate through JSON object returned by SQL query and add new SnackPack objects to list_snackpacks
										var scoreboard={};
										for(var r in result){
										var roundTmp = result[r];
										scoreboard[result[r].handle] = result[r].roundsWon;
										}
										resolve(scoreboard);
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
	nextRound(winnerID){
		return new Promise((resolve, reject) => {
				//callback to initiate connection to AWS RDS
				var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
				connection.connect(function(err) {
						if (err) throw err;
						//callback to send query
						console.log(winnerID);
						connection.query(`select * from loveLetter.users where handle="${winnerID}"`, function(err, res, fields){
						if (err) reject(err);
							console.log(res);
							var x = res[0].roundsWon + 1;
						connection.query((`update loveLetter.users set roundsWon=${x} where handle="${winnerID}"`), function(err, result, fields){

								if(err) reject(err);
								connection.end(function (err){
										if (err) reject(err);
										resolve(true);
										});
								});
						});
				});
		});
	}	

	// addPlayer(string name)
	addPlayer(playerName){
		console.log("ADDING " + playerName + "TO THE DB");
		return new Promise((resolve, reject) => {
				//callback to initiate connection to AWS RDS
				var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
				connection.connect(function(err) {
						console.log("adding player step 1");
						if (err) throw err;
						//callback to send query
						connection.query((`insert into loveLetter.users values("${playerName}", 0)`), function(err, result, fields){
								console.log("adding player step 3");
								if(err) reject(err);
								connection.end(function (err){
										console.log("success");
										if (err) reject(err);
										resolve(true);
										});
								});
						});
				});
	}

	checkWinner(){
		console.log("checking winnner");
		return new Promise((resolve, reject) => {
				//callback to initiate connection to AWS RDS
				var connection = mysql.createConnection({host:this.host, user:this.user, password:this.password, port:this.port});
				connection.connect(function(err) {
						if (err) throw err;
						//callback to send query
						connection.query(`select * from loveLetter.users`, function(err, count, fields){
								connection.end(function (err){
										for(var x in count){
										if(count[x].roundsWon == 5){
										console.log(count[x].handle + " won");
										resolve(count[x].handle);
										}
										}
										resolve(false);
										});
								});
						});
				});
	}
}
//Allows module to be exposed
module.exports = loveConnector;