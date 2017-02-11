/*
Going to keep a running list of comments about design desisions, what I learned, etc.
(Appending comments rather than replacing)

I want to create some sort of data structure to contain variables about a "tron bike/player"
maybe something as simple as object literals (example 2 in https://www.phpied.com/3-ways-to-define-a-javascript-class/)
Then client methods would edit one of a series of player objects in an array

Experimented with canvas. Discrete array of rgba values is easily accessible.
Shapes drawn such that the value wouldn't cover a discrete pixels use alpha to compensate.
For example, a line of width 1 drawn horizontally at an integer y value of 30
will change the value of the pixels in row 29 and 30 by 50% for alpha and some fraction for each of rgba
On the other hand, if the line is width 2, it completely overwrites the data above and below
For minimal complexity of logic, I'd like to always draw in a way that completely overwrites data and uses full alpha.
The simplest way to achieve this is even, integral line widths and integral position coordinates.

Could talk about requestAnimationFrame as new/complex
*/




/*                                     START OF PLAYER DEFINITION                               */
// Define Player "class"
function Player (name, color, direction, position) {
   this.name = name;//"Drake";
   this.color = color;//"#FF0000"; // red
   this.direction = direction;//1;// 0:left, 1:up, 2:right, 3:down
   this.position = position;//[0, 0];
   this.alive = true;
}
// Player "public" functions
Player.prototype.right  = function(){this.turn(2);};
Player.prototype.left   = function(){this.turn(0);};
Player.prototype.up     = function(){this.turn(1);};
Player.prototype.down   = function(){this.turn(3);};

// testing function
Player.prototype.getInfo = function(){
   return this.name + ' ' + this.color + ' ' + this.direction + ' ' + this.position;
};

// Player "private"/internal functions
Player.prototype.turn = function(dir){
   // if not opposite current direction;
   if(Math.abs(this.direction - dir) != 2)
      this.direction = dir;
};
   
Player.prototype.forward = function(pixels){
   var dir = this.direction;
   this.position[dir%2] += pixels * (Math.floor(dir/2)*2 - 1);
};
/*                                     END OF PLAYER DEFINITION                               */
function animationDraw(){
   //ctx.clearRect(0,0, canvas.width, canvas.height);//fresh slate
   players.forEach(advancePlayer);
   raf = window.requestAnimationFrame(animationDraw);
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

//decided against using shapes for players for now to simplify collision/drawing logic
// function drawPlayer(position){
   // var temp = ctx.globalAlpha;
   // ctx.globalAlpha = 0.5;
   // ctx.fillRect(position[0]-2, position[1]-2, 4, 4);
   // ctx.globalAlpha = temp;
// }
// function erasePlayer(position){
   
   // ctx.clearRect(position[0]-2, position[1]-2, 4, 4);
// }
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

function test1(){
   window.cancelAnimationFrame(raf);
}

function rightAll(){
   players.forEach(function(player){player.right();});   
}
function leftAll(){
   players.forEach(function(player){player.left();});
}
function upAll(){
   players.forEach(function(player){player.up();});   
}
function downAll(){
   players.forEach(function(player){player.down();});
}
function test21(p1, p2){console.log(p1.getInfo() + '\n' + p2.getInfo());}
function test2(){
   ctx.strokeStyle = "#FF0000";
   ctx.moveTo(31, 41);
   ctx.lineTo(35, 41);
   ctx.stroke();
   drawPlayer([31,41]);
   // ctx.beginPath();
   // ctx.strokeStyle = "#0000FF";
   // ctx.moveTo(53, 58);
   // ctx.lineTo(97, 93);
   // ctx.stroke();
   test3(29, 39, 6, 4);
}

function test3(x0, y0, x1, y1){
   console.log(ctx.getImageData(x0, y0, x1, y1));
}

// function toggleCrawl(){
   // if(crawling){
      // clearInterval(timer);
   // } else {
      // timer = setInterval(function() {forward();}, delay);
   // }
   // crawling = !crawling;
// }

// function right(){
   // direction = (direction + 1) % 4;
// }

// function left(){
   // direction = (direction + 3) % 4;
// }

// function forward(){
   // update position to be crawlLength units in the right direction
   // position[direction%2] += crawlLength * (Math.floor(direction/2)*2 - 1);
   
   // ctx.lineTo(position[0], position[1]);
   // ctx.stroke();
   
   // if(!withinBounds()){
      // toggleCrawl();
   // }
// }

function init(){
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
// function withinBounds(){
   // if(position[0]>=0 && position[1]>=0 && position[0]<=dims[0] && position[1]<=dims[1]){
      // if within bounds
      // return true;
   // } else {
      // if outside bounds, bring back to wall
      // position[0] = Math.max(0, Math.min(position[0], dims[0]));
      // position[1] = Math.max(0, Math.min(position[1], dims[1]));
      // return false;
   // }
// }
