//local client

//'Constructor'
var Player = function(name){
   var position,
   direction,
   alive =true,
   color,
   id;
   
   return {
      position : position,
      direction : direction,
      alive : alive,
      color : color,
      name: name, 
      id : id,
      getInfo: getInfo,
      forward: forward,
      turn: turn
   }
};