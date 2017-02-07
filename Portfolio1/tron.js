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
*/




/*                                     START OF PLAYER DEFINITION                               */
// Define Player "class"
function Player (name) {
   this.name = "Drake";
   this.color = 0xFF0000; // red
   this.direction = 1;// 0:left, 1:up, 2:right, 3:down
   this.position = [0, 0];
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
   if(Math.abs(this.direction - dir) != 2){
      this.direction = dir;
   }
};
/*                                     END OF PLAYER DEFINITION                               */


function test1(){
   ctx.strokeStyle = "#FF0000";
   ctx.lineTo(31, 47);
   ctx.stroke();
}

function test21(p1, p2){console.log(p1.getInfo() + '\n' + p2.getInfo());}
function test2(){
   var player1 = new Player("Drake");
   var player2 = new Player("Mason");
   player1.color = 0x00FF00; //change attributes
   test21(player1, player2);
   player1.right();
   test21(player1, player2);
   player1.left();//shouldn't change
   test21(player1, player2);
   player1.down();
   player2.left();
   test21(player1, player2);
   player1.left();
   test21(player1, player2);
}

function test3(){
   console.log(ctx.getImageData(30, 40, 3, 8));
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
   canvas = document.getElementById("myCanvas");
   ctx = canvas.getContext("2d");
   
   dims = [canvas.width, canvas.height];
   // crawlLength = 2;
   delay = 40;
   crawling = false;
   
   ctx.lineWidth = 2;
   ctx.strokeStyle = "#FF0000";
   ctx.moveTo(31,41);
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
