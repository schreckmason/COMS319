function toggleCrawl(){
	if(crawling){
		clearInterval(timer);
	} else {
		timer = setInterval(function() {forward();}, 40);
	}
	crawling = !crawling;
	
	printInfo("toggleCrawl");
}

function right(){
	direction = (direction + 1) % 4;
	
	printInfo("right");
}

function left(){
	direction = (direction + 3) % 4;
	
	printInfo("left");
}

function forward(){
	position[direction%2] += crawlLength * (Math.floor(direction/2)*2 - 1);
	
	ctx.lineTo(position[0], position[1]);
	ctx.stroke();
	
	if(!withinBounds()){
		toggleCrawl();
	}
	
	printInfo("forward");
}

function init(){
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	
	dims = [canvas.width, canvas.height];
	direction = 1;// 0:left, 1:up, 2:right, 3:down
	position = [31, 41];
	crawlLength = 2;
	crawling = false;
	
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#FF0000";
	ctx.moveTo(position[0], position[1]);
	
	printInfo("init");
}

function withinBounds(){
	if(position[0]>0 && position[1]>0 && position[0]<=dims[0] && position[1]<=dims[1]){
		// if within bounds
		return true;
	} else {
		// if outside bounds
		// bring back to wall
		position[0] = Math.max(0, Math.min(position[0], dims[0]));
		position[1] = Math.max(0, Math.min(position[1], dims[1]));
		return false;
	}
}

function printInfo(funcName){
	console.log(funcName + ":" + "\n" +
		"\t" + "direction: " + direction + "\n" +
		"\t" + "position: " + position + "\n" +
		"\t" + "dims: " + dims + "\n" +
		"\t" + "crawling: " + crawling + "\n" +
		"\t" + "crawlLength: " + crawlLength + "\n");
}

function test(){
	console.log(Math.max(-3, 5) + " " + Math.max(1.4, 6));
}