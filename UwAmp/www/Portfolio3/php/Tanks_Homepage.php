<?php

?>
<html>
<!--Potentially use bootstrap to make me look pretty however for now this primarily functions as a plcaeholder page to get something pushed to heroku-->
<head>
<!--Attach scripts needed here-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
</head>
<body>
<h1>Welcome to BattleBots</h1>

<!--PRIMARY-->
<!--Button for control display, button to begin playing-->
<p><input type="button" id="playButton" value="Play!"></p> 

<!--SECONDAY-->
<!--Leaderboard, personal best, select bot AI-->

<!--JQuery for user to register user input and do something-->
<script>
$(document).ready(function(){
	$('#playButton').click(function(){
		//Redirect to game screen (will change if we implement login, must validate login prior to redirection)
		window.location.href = './Game.php';
	});
});
</script>
</body>

</html>
