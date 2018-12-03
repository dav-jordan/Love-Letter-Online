# loveLetter API
## What's in the database?
* int `id`
* json `players`
* int `numPlayers`
* int `numRounds`

## What's in loveConnect.js???

### Notes
* `players` json
	* id `int` 
	* name `string` 
	* hand `array` 

### getGames()
* takes no parameters
* returns a list of `round` objects

### createGames()
* takes `players` (json)
* returns true if all goes well

### nextRound()
* takes `