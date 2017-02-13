//local client

//'Constructor'
var Player = function(name){
   var position,
   direction,
   alive,
   color,
   id;
   
   var turn = function(dir){
      // if not opposite current direction;
      if(Math.abs(this.direction - dir) != 2)
         direction = dir;
   };
   
   var forward = function(pixels){
      position[direction%2] += pixels * (Math.floor(direction/2)*2 - 1);
   };
   
   //testing purposes
   var getInfo = function(){
      return this.name + ' ' + this.color + ' ' + this.direction + ' ' + this.position;
   };
};