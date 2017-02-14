//local client

//'Constructor'
var Player = function(name){
   var position,
   prevPos,//only used by remote players
   // 0:left, 1:up, 2:right, 3:down
   direction,//only used by local player
   alive = true,
   color,
   id,
   moveReady = false;
   
   var moveTo = function(pos){
      this.prevPos = this.position;
      this.position = pos;
      this.moveReady = true;
   }
   
   //only used for local player
   var turn = function(dir){
      // if not opposite current direction;
      if(Math.abs(this.direction - dir) != 2)
         this.direction = dir;
   };

   //only used for local player
   var forward = function(pixels){
      var newPos = this.position.slice(); 
      newPos[this.direction%2] += pixels * (Math.floor(this.direction/2)*2 - 1);
      this.moveTo(newPos);
   };
   
   return {
      moveReady: moveReady,
      position : position,
      prevPos : prevPos,
      direction : direction,
      alive : alive,
      color : color,
      name: name, 
      id : id,
      //functions
      forward: forward,
      moveTo: moveTo,
      turn: turn
   };
};