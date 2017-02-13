/*
Node Requirements
*/
var io = require("socket.io"),//run node with sockets
Player = require("./game.client.js").Player;
//var Player = require("./game.client.js").Player;

/*
Global Variables
*/
var socket;
var players;

function initializeWorld(){
	//array of player 'class' objects
	players = [];
	socket = io.listen(8000);//set the server to listen on port 8000
	console.log("Server started");//if port not used log this to terminal
	setConnectionHandlers();//connection, termination, new, and move events
}

var setConnectionHandlers = function() {
	socket.on("connection", onConnection);
	//console.log("connected");

};

function onConnection(client){
	console.log("New player has connected: "+client.id);

	//disconnect
	client.on("disconnect", onDisconnect);

	//new
	client.on("new player", onNewPlayer);

	//move

};

function onDisconnect(){
var removePlayer = findPlayer(this.id);//look for a player using connection id
if(!removePlayer){
	return;
};

players.splice(players.indexOf(removePlayer),1);
this.broadcast.emit("remove player",{id: this.id});
};

function onNewClient(input){
var newPlayer = new Player('mason');//prompt user for name
newPlayer.id = this.id;

//color, direction, position, alive
//this.broadcast.emit("new player",{id:})

};

function onMoveEvent(input){

};

function findPlayer(id){
	var i;
	for(i=0; i<players.length;i++){
		if(players[i].id == id)
			return players[i];
	};

	return false;
};

/*
Run Game
Need a top-level client within this same directory (referenced in init)
Player.js (Player = require("./[directory]").Player)
*/
initializeWorld();