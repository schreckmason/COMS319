/*
Node Requirements
*/
io = require("socket.io");//run node with sockets
Player = require("./game.client.js").Player;
//var Player = require("./game.client.js").Player;

/*
Global Variables
*/
colors = ["#FF0000", "#FF0000", "#008800", "#FFFF00"]
directions = [0, 1, 2, 3];
positions = [
   [30, 30],
   [130, 50],
   [50, 180],
   [200, 150]];

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

   //initialize id, color, position, direction
   client.on("initPlayer", onInitPlayer);
   
	//disconnect
	// client.on("disconnect", onDisconnect);

	//move
	client.on("move event", onMoveEvent);
   

};

function onMoveEvent(input){
   this.broadcast.emit("move event", {id: input.id, position: input.position})
}

function onInitPlayer(input){
   console.log("onInitPlayer: ");
   console.log(input);
   
   // give new player id, color, direction, position
   var newPlayer = new Player(input.name, this.id);
   initPlayerData(newPlayer);
   this.emit("initPlayer", {
      id:newPlayer.id,
      color:newPlayer.color, 
      direction:newPlayer.direction, 
      position:newPlayer.position});
   
	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {
         id: existingPlayer.id,
         name: existingPlayer.name,
         position: existingPlayer.position,
         color: existingPlayer.color,
         direction: existingPlayer.direction,
         alive: existingPlayer.alive});
	};
   
   // broadcast new player to all except sender
   this.broadcast.emit("new player", {
         id: newPlayer.id,
         name: newPlayer.name,
         position: newPlayer.position,
         color: newPlayer.color,
         direction: newPlayer.direction});
   
   players.push(newPlayer);
   
   if(players.length == 4){
      //send start msg to all
      this.broadcast.emit("start game");//to all but this
      this.emit("start game");//to this
   }
}

function initPlayerData(player){
   //give color, direction, and position to player
   //TODO: Make algorithm to distribute these
   
   player.color = colors[players.length];
   player.direction = directions[players.length];
   player.position = positions[players.length];
   
}

// function onDisconnect(){
   // var removePlayer = findPlayer(this.id);//look for a player using connection id
   // if(!removePlayer){
      // return;
   // };

   // players.splice(players.indexOf(removePlayer), 1);
   // this.broadcast.emit("remove player",{id: this.id});
// };

// function onMoveEvent(input){
   // console.log(this.key);
// };

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