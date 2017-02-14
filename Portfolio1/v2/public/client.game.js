var socket,
  localPlayer,
  remotePlayers;
  

/* ------------------------- HELPERS -------------------------*/
function findPlayer(id){
   var i;
   for(i=0; i<remotePlayers.length;i++){
      if(remotePlayers[i].id == id)
         return remotePlayers[i];
   };
   return false;
}

/* ------------------------- SETUP -------------------------*/
function init(){
   //global variables
   socket = io.connect("ws://127.0.0.1:8000");
   remotePlayers = [];
   localPlayer = new Player("Mason");//prompt for name
   // state control variables
   readyToDraw = false;
   readyToMove = false;
   
   //start listening
   setEventHandlers();
   //request player initialization from server
   socket.emit("initPlayer", {name:localPlayer.name});
   
   canvas = document.getElementById("myCanvas");
   ctx = canvas.getContext("2d");
   ctx.lineWidth = 2;
   window.addEventListener("keydown", keyPressed, false);
}

function setEventHandlers() {
   // socket.on("connect", onSocketConnected);
   
   //setting up game
   socket.on("initPlayer", onInitPlayer);
   socket.on("new player", onNewPlayer);//

   //animating
   socket.on("start game", onStartGame);//start moving
   socket.on("move", onMoveEvent);//remote player moved
   socket.on("crash", onPlayerCrash);//remote player collided
}

//initialize local player with state given by server
function onInitPlayer(input){
   localPlayer = new Player()
   localPlayer.id = input.id;
   localPlayer.color = input.color;
   localPlayer.direction = input.direction;
   localPlayer.position = input.position;
   localPlayer.alive = true;
   localPlayer.prevPos = input.position;
   localPlayer.moveReady = false;
   
   // console.log("local player initialized: ");
   // console.log(localPlayer);
}

//remote player joined
function onNewPlayer(input){
   // console.log("onNewPlayer: ");
   // console.log(input);
   
   rPlayer = new Player(input.name);
   rPlayer.id = input.id;
   rPlayer.color = input.color;
   rPlayer.position = input.position;
   rPlayer.prevPos = input.position;
   
   remotePlayers.push(rPlayer);
}

/* ------------------------- ANIMATION -------------------------*/

function animateIfReady(){
   // console.log("animateIfReady: \n\tdraw: "+readyToDraw+"\n\tmove: "+readyToMove);
   if(readyToDraw && readyToMove){
      // remote players always move first
      remotePlayers.forEach(function(p){
         //don't worry about checking collision of remote players.
         //they will check/signal their own collision
         if(p.alive){
            drawLine(p.prevPos, p.position, p.color);
            p.moveReady = false;
         }else{
            // console.log(p.id+" is dead");
         }
      });
      if(localPlayer.alive){
         //now local player moves
         var crashed = checkCollision(localPlayer.position);
         if(crashed){
            // console.log("crashed: " + crashed);
            localPlayer.alive = false;
            signalCrash();
         }
         drawLine(localPlayer.prevPos, localPlayer.position, localPlayer.color);
      } else {
         // console.log("I am dead");
      }
      
      readyToDraw = false;
      readyToDraw = false;
      raf = window.requestAnimationFrame(animationFrameReady);
   }
}

function animationFrameReady(){
   // console.log("animation frame ready");
   
   //send local player move but don't draw yet
   if(localPlayer.alive){
      localPlayer.forward(2);
      sendMove();
   }
   
   readyToDraw = true;
   animateIfReady();
}

//checks if all active players have moved since last animation
function allMoved(){
   if(localPlayer.alive && !localPlayer.moveReady)
      return false;
   for(var i=0; i<remotePlayers.length;i++){
      if(remotePlayers[i].alive && !remotePlayers[i].moveReady)
         return false;
   };
   return true;
}

//draw line from iPos to fPos with given color
function drawLine(iPos, fPos, color){
   // console.log("drawLine: "+iPos+' '+fPos+' '+color);
   ctx.beginPath();
   ctx.strokeStyle = color;
   ctx.moveTo(iPos[0], iPos[1]);
   ctx.lineTo(fPos[0], fPos[1]);
   ctx.stroke();
}

//helper to check if grid position is okay to traverse
function checkCollision(position){
   // console.log("checkCollision: " + position)
   var collision = false;
   var x = position[0];
   var y = position[1];
   var xMax = canvas.width;
   var yMax = canvas.height;
   
   if(x>xMax || y>yMax || x<0 || y<0){
      collision = true;
   } else {
      var imgData = ctx.getImageData(x-1, y-1, 2, 2);
      // console.log(imgData.data);
      for(var i = 0; i<imgData.data.length; i+=4){
         var alpha = imgData.data[i+3];
         collision |= (alpha == 255)
      }
   }
   return collision;
}

//remote player moved
function onMoveEvent(input){
   console.log(input.position);
   //update state but no drawing here
   var player = findPlayer(input.id);
   console.log(player.position);
   console.log(player.prevPos);
   player.moveTo(input.position);
   if(allMoved()){
      readyToMove = true;
      animateIfReady();
   }
}

//remote player collision
function onPlayerCrash(input){
   // console.log("onPlayerCrash");
   // console.log(input);
   findPlayer(input.id).alive = false;
}

//start animating
function onStartGame(){
   // console.log("Starting game!");
   raf = window.requestAnimationFrame(animationFrameReady);
}

//local player crash
function signalCrash(){
   // console.log("I crashed!");
   //TODO:maybe send position of crash too?
   socket.emit("crash", {id: localPlayer.id});
}

function sendMove(){
   // console.log("Sending move");
   socket.emit("move", {id: localPlayer.id, position: localPlayer.position});
}

//keyboard input for local player turning
function keyPressed(e) {
   switch(e.keyCode) {
      case 37: // left key pressed
         localPlayer.turn(0);
         break;
      case 38: // up key pressed
         localPlayer.turn(1);
         break;
      case 39: // right key pressed
         localPlayer.turn(2);
         break;
      case 40: // down key pressed
         localPlayer.turn(3);
         break;
      default:
         break;
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
   }
}

// function stopAnimation(){
   // window.cancelAnimationFrame(raf);
// }