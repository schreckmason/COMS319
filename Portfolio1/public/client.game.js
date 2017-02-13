var socket,
	localPlayer,
	remotePlayers;

function init(){
	socket=io.connect("ws://127.0.0.1:8000");
	reomtePlayers = [];
	setEventHandlers();
};