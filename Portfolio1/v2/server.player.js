/*
Game Client
*/

//'Constructor'
var Player = function(name, id){
   var position,
   direction,
   color,
   alive = true;

   //CHECK ME for pass by reference
   return {
      position : position,
      direction : direction,
      alive : alive,
      color : color,
      name: name, 
      id : id
   }
};

/*
Export for node access*/
exports.Player=Player;