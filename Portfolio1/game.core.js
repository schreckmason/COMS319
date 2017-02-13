/*
Node Requirements
*/
var io = require("socket.io");//run node with sockets

/*
Global Variables
*/
var socket;
var clients;

function initializeWorld(){
	//array of player 'class' objects
	clients = [];
	socket = io.listen(8000);//set the server to listen on port 8000
	console.log("Server started");//if port not used log this to terminal
	setConnectionHandlers();//connection, termination, new, and move events
}

var setConnectionHandlers = function() {
	socket.on("connection", onConnection);
	console.log("connected");

	//client.on()
};

function onConnection(client){
	console.log("New player has connected: ")//append client.id
	//disconnect
	client.on("disconnect", onDisconnect);

	//new

	//move

};

function onDisconnect(){

};

function onNewClient(input){

};

function onMoveEvent(input){

};

function findPlayer(id){
	var i;
	for(i=0; i<clients.length;i++){
		if(clients[i].id == id)
	}

};

/*
Run Game
Need a top-level client within this same directory (referenced in init)
Player.js (Player = require("./[directory]").Player)
*/
initializeWorld();