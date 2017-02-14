var socket,
  localPlayer,
  remotePlayers;

function init(){
  socket=io.connect("ws://127.0.0.1:8000");
  remotePlayers = [];
  setEventHandlers();

   // raf = window.requestAnimationFrame(animationDraw);
   
   canvas = document.getElementById("myCanvas");
   ctx = canvas.getContext("2d");
   ctx.lineWidth = 2;
   ctx.strokeStyle = "#FF0000";
   
   localPlayer = new Player("Mason");//prompt for name
   socket.emit("initPlayer", {name:localPlayer.name});//request player initialization from server
   
   // window.addEventListener("keydown", keyPressed, false);
}

function setEventHandlers() {
   // socket.on("connect", onSocketConnected);
   socket.on("initPlayer", onInitPlayer);
   socket.on("new player", onNewPlayer);
   socket.on("start game", onStartGame);
   socket.on("move event", onMoveEvent);
}

function onMoveEvent(input){
   //remote player moving
   var player;
   for(i=0; i<players.length;i++){
		if(players[i].id == input.id){
			player = players[i];
         break;
      }
	}
   //need to move to new position and have drawn at next event
   //probably best if all players (remote and local) are just drawn at their current position at each refresh
   //move events would then change the position of remote players (direction irrelevent)
   //keyboard events would change direction of local player which would be moved forward each refresh
}

function onInitPlayer(input){
   localPlayer.id = input.id;
   localPlayer.color = input.color;
   localPlayer.direction = input.direction;
   localPlayer.position = input.position;
   
   console.log("local player initialized: ");
   console.log(localPlayer);
}

function onSocketConnected(){
   console.log("Connected to server");
   // this.emit("new player", {id: localPlayer.id, x: existingPlayer.getX(), y: existingPlayer});
}

function onNewPlayer(input){
   console.log("onNewPlayer: ");
   console.log(input);
   
   rPlayer = new Player(input.name);
   rPlayer.id = input.position;
   rPlayer.color = input.position;
   rPlayer.direction = input.position;
   rPlayer.position = input.position;
   remotePlayers.push(rPlayer);
}

function onStartGame(){
   console.log("Starting game!");
   animationDraw();
}

function checkCollision(position){
   var collision = false;
   var x = position[0];
   var y = position[1];
   var xMax = canvas.width;
   var yMax = canvas.height;
   
   if(x>xMax || y>yMax || x<0 || y<0){
      collision = true;
   } else {
      var imgData = ctx.getImageData(x-1, y-1, 2, 2);
      console.log(imgData.data);
      for(var i = 0; i<imgData.data.length; i+=4){
         var alpha = imgData.data[i+3];
         collision |= (alpha == 255)
      }
   }
   return collision;
}

// function keyPressed(e) {
    // switch(e.keyCode) {
        // case 37: // left key pressed
            // players[1].left();
            // break;
        // case 38: // up key pressed
            // players[1].up();
            // break;
        // case 39: // right key pressed
            // players[1].right();
            // break;
        // case 40: // down key pressed
            // players[1].down();
            // break;
        // case 87: // w key pressed
            // players[0].up();
            // break;
        // case 65: // a key pressed
            // players[0].left();
            // break;
        // case 83: // s key pressed
            // players[0].down();
            // break;
        // case 68: // d key pressed
            // players[0].right();
            // break; 
            
    // }   
// }

function animationDraw(){
   // ctx.clearRect(0,0, canvas.width, canvas.height);//fresh slate
   // players.forEach(advancePlayer);
   advancePlayer(localPlayer);
   raf = window.requestAnimationFrame(animationDraw);
}

// function stopAnimation(){
   // window.cancelAnimationFrame(raf);
// }

function advancePlayer(player){
   if(player.alive){
      var pos0 = [player.position[0], player.position[1]];
      player.forward(2);
      if(checkCollision(player.position)){
         player.alive = false;
         console.log("Collided");
      }
      
      //TODO:emit move event for other players
      
      ctx.beginPath();
      ctx.strokeStyle = player.color;
      ctx.moveTo(pos0[0], pos0[1]);
      ctx.lineTo(player.position[0], player.position[1]);
      ctx.stroke();
   }
}
   
var turn = function(dir){
   // if not opposite current direction;
   if(Math.abs(this.direction - dir) != 2)
      this.direction = dir;
};

var forward = function(pixels){
   this.position[this.direction%2] += pixels * (Math.floor(this.direction/2)*2 - 1);
};

//testing purposes
var getInfo = function(){
   return this.name + ' ' + this.color + ' ' + this.direction + ' ' + this.position;
};