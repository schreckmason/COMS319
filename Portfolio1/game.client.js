/*
Game Client
*/

//'Constructor'
var Player = function(name){
	var position,
	direction,
	alive,
	color,
	id;

	//CHECK ME for pass by reference
	return {
		position : position,
		direction : direction,
		alive : alive,
		color : color,
		id : id
	}
};


/*
Export for node access*/
exports.Player=Player;