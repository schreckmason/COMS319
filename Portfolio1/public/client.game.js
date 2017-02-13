var socket,
  localPlayer,
  remotePlayers;

function init(){
  socket=io.connect("ws://127.0.0.1:8000");
  remotePlayers = [];
  setEventHandlers();

   raf = window.requestAnimationFrame(animationDraw);
   
   canvas = document.getElementById("myCanvas");
   ctx = canvas.getContext("2d");
   ctx.lineWidth = 2;
   ctx.strokeStyle = "#FF0000";
   
   players = [];
   players.push(new Player("Mason", "#FF0000", 0, [canvas.width, canvas.height/2]));
   players.push(new Player("Drake", "#0000FF", 2, [0, canvas.height/2]));
   test21(players[0], players[1]);
   window.addEventListener("keydown", keyPressed, false);
}

var setEventHandlers = function() {
socket.on("connect",onSocketConnected);
};

function onSocketConnected(){
  console.log("Connected to server");
};

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

function keyPressed(e) {
    switch(e.keyCode) {
        case 37: // left key pressed
            players[1].left();
            break;
        case 38: // up key pressed
            players[1].up();
            break;
        case 39: // right key pressed
            players[1].right();
            break;
        case 40: // down key pressed
            players[1].down();
            break;
        case 87: // w key pressed
            players[0].up();
            break;
        case 65: // a key pressed
            players[0].left();
            break;
        case 83: // s key pressed
            players[0].down();
            break;
        case 68: // d key pressed
            players[0].right();
            break; 
            
    }   
}

function animationDraw(){
   //ctx.clearRect(0,0, canvas.width, canvas.height);//fresh slate
   players.forEach(advancePlayer);
   raf = window.requestAnimationFrame(animationDraw);
}

function stopAnimation(){
   window.cancelAnimationFrame(raf);
}

function advancePlayer(player){
   if(player.alive){
      var pos0 = [player.position[0], player.position[1]];
      player.forward(2);
      if(checkCollision(player.position)){
         player.alive = false;
         console.log("Collided");
      }
      
      ctx.beginPath();
      ctx.strokeStyle = player.color;
      ctx.moveTo(pos0[0], pos0[1]);
      ctx.lineTo(player.position[0], player.position[1]);
      ctx.stroke();
   }
}