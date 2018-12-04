// Initialize packages
var Express = require('express');
var HTTP = require('http');
var IO = require('socket.io);
var Game = require('./game');

// Initialize package objects
var app = Express();
var http = HTTP.Server(app);
var io = IO(http);
let game = new Game();


// Statically serve files
app.use('/', Express.static('game'));


app.get('/', (req, res) => {
	res.send('<h1>Hello world<h/1>');
}); 


// Check if PORT was predefined on system
let PORT = process.env.PORT|80;

// Listen to requests
http.listen(PORT, () => {
	console.log("Listening on " + PORT + "...");
});

io.on('connection', (socket) => {
	console.log('Connection initiated with socket' , socket.id);
});
