function toggleCrawl(){
	if(crawling){
		clearInterval(timer);
	} else {
		timer = setInterval(function() {forward();}, delay);
	}
	crawling = !crawling;
}

function right(){
	direction = (direction + 1) % 4;
}

function left(){
	direction = (direction + 3) % 4;
}

function forward(){
	// update position to be crawlLength units in the right direction
	position[direction%2] += crawlLength * (Math.floor(direction/2)*2 - 1);
	
	ctx.lineTo(position[0], position[1]);
	ctx.stroke();
	
	if(!withinBounds()){
		toggleCrawl();
	}
}

function init(){
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	
	dims = [canvas.width, canvas.height];
	direction = 1;// 0:left, 1:up, 2:right, 3:down
	position = [dims[0]/2, dims[1]/2];
	crawlLength = 2;
	delay = 40;
	crawling = false;
	
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#FF0000";
	ctx.moveTo(position[0], position[1]);
}

function withinBounds(){
	if(position[0]>=0 && position[1]>=0 && position[0]<=dims[0] && position[1]<=dims[1]){
		// if within bounds
		return true;
	} else {
		// if outside bounds, bring back to wall
		position[0] = Math.max(0, Math.min(position[0], dims[0]));
		position[1] = Math.max(0, Math.min(position[1], dims[1]));
		return false;
	}
}