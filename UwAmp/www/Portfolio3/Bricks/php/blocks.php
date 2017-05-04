<!DOCTYPE html>
<html>
<style>
body {
   background-color: black;
}
</style>
<head>
   <meta charset="utf-8" />
   <title>Dope Ass Game</title>
   <style>* { padding: 0; margin: 0; }</style>
   <script src="../js/phaser.min.js"></script>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
</head>
<body>
<p id="tempPar"></p>
<script>
   /*--------------------------------------------------------  GAME SETUP  ------------------------------------------------------*/
   //This auto initializes the canvas element
   //Parameters: width, height, rendering method (AUTO usually defaults to WebGL, falls back to Canvas 2D), id of the canvas
   var game = new Phaser.Game(800, 580, Phaser.AUTO, null,{
      preload: preload, create: create, update: update
   });
   
   //We can change this to be our player image later
   var ball;
   var maxPaddleDeflectAngle = 65; //The maximum angle from vertical at which the ball will bounce off the paddle (left:-90, up:0, right:90)
   var gameSpeed = 1.0;
   var paddleSpeed = 6;
   var initialBallSpeed = 300;
   var lastBallVelocity = undefined;
   var paddle;
   var stickyBall;//ball sticks to paddle
   //Handle creation of brick objects
   var lastKilledBrick = undefined;
   var bricks;
   var barriers;
   var newBrick;
   var brickInfo;
   //Score text
   var scoreText;
   var score = 0;
   //Add Player Lives
   var lives = 3;
   var heart1;
   var heart2;
   var heart3;
   //game level implementation
   var level=1;
   var finalLevel = false;
   var lvlPass=0;
   var lvlScore=0;
   
   //preloads page assets
   function preload() {
      //Scale the canvas to any screen size
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      game.stage.backgroundColor = '#eee';
      
      
      game.load.image('ball','../img/isuBall.png');
      game.load.image('paddle','../img/paddle.png');
      game.load.image('brick', '../img/brick.png');
      game.load.image('barrier', '../img/barrier.png');
      game.load.image('heart', '../img/heart.png');
   }
   
   //executed once all assets are lodaed and ready
   function create() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
      ball.scale.set(0.2,0.2);
      ball.anchor.set(0.5);
      
      game.physics.enable(ball, Phaser.Physics.ARCADE);
      ball.body.collideWorldBounds = true;
      ball.body.bounce.set(1);

      paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
      
      paddle.scale.set(0.6,0.6);
      paddle.anchor.set(0.5,1);
      game.physics.enable(paddle, Phaser.Physics.ARCADE);
      paddle.body.collideWorldBounds = true;
      paddle.body.immovable = true;
      
      initBricks(level);
      prepareBallForShot();
      
      //Game Over Logic
      ball.events.onOutOfBounds.add(ballLeaveScreen, this);
      game.physics.arcade.checkCollision.down = false;
      ball.checkWorldBounds = true;
      //Game Score
      scoreText = game.add.text(5,5, 'Points: 0',{font: '18px Arial', FILLD: '#0095DD'});
      //Life Alert
      heart1 = game.add.sprite(game.world.width/2.0+250,450,'heart');
      heart2 = game.add.sprite(game.world.width/2.0,450, 'heart');
      heart3 = game.add.sprite(game.world.width/2.0-250, 450, 'heart');
      heart1.anchor.set(0.5);
      heart2.anchor.set(0.5);
      heart3.anchor.set(0.5);
      game.world.sendToBack(heart1);
      game.world.sendToBack(heart2);
      game.world.sendToBack(heart3);
      heart1.immovable = true;
      heart2.immovable = true;
      heart3.immovable = true;
   }
   
   /*--------------------------------------------------------  LEVEL INITIALIZATION  ------------------------------------------------------*/

   //Change this to take in parameters to construct various brick fields
   function initBricks(lvl){
      $.post("./getLevel.php", {level_num: lvl}, function(response, status){
         console.log(response);
         var levelInfo = JSON.parse(response);
         var blockGroups = levelInfo.blockGroups;
         finalLevel = levelInfo.finalLevel;//boolean (Is this the final level?)
         lvlPass = levelInfo.points;
         bricks = game.add.group();
         barriers = game.add.group();
         blockGroups.forEach(function(groupDetails) {
            placeBlocks(groupDetails);
         });
      });
   }
   
   //Place a single block group
   function placeBlocks(groupDetails){
      for(r=0;r<groupDetails.rows; r++){
         for(c=0; c<groupDetails.cols; c++){
            //Set x value of block
            var groupWidth = groupDetails.cols*groupDetails.width + (groupDetails.cols-1)*groupDetails.hPadding;
            var anchor = groupDetails.hAlign; //left/right/center
            var groupHorizontalOffset = (anchor=="left"?0:((game.world.width - groupWidth)/(anchor=="right"?1.0:2.0))) + groupDetails.hOffset;
            var brickX = groupHorizontalOffset + c * (groupDetails.width + groupDetails.hPadding);
            //Set y value of block
            var brickY = r*(groupDetails.height+groupDetails.vPadding) + groupDetails.vOffset;
            var newBrick = game.add.sprite(brickX, brickY, 'brick');
            newBrick.anchor.set(0);
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            //Set special brick properties
            switch(groupDetails.type){
               case "moveLeft":
                  newBrick.body.velocity.set(-200*gameSpeed,0);
                  newBrick.body.collideWorldBounds=true;
                  newBrick.body.bounce.set(1);
                  bricks.add(newBrick);
                  break;
               case "moveRight":
                  newBrick.body.velocity.set(200*gameSpeed,0);
                  newBrick.body.collideWorldBounds=true;
                  newBrick.body.bounce.set(1);
                  bricks.add(newBrick);
                  break;
               case "barrier":
                  newBrick.loadTexture('barrier');//overwrite texture
                  barriers.add(newBrick);
                  break;
               default:
                  bricks.add(newBrick);
                  break;
            }
         }
      }
   }
   
   /*--------------------------------------------------------  MOVEMENT HANDLERS  ------------------------------------------------------*/
   
   //executed on every frame
   function update() {
      game.physics.arcade.collide(ball, paddle, ballHitPaddle);
      game.physics.arcade.collide(ball,bricks, ballHitBrick);
      game.physics.arcade.collide(ball,barriers);
      if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
         paddle.x -= paddleSpeed * gameSpeed;
         if(stickyBall){ball.x = paddle.x;}
      }else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
         paddle.x += paddleSpeed * gameSpeed;
         if(stickyBall){ball.x = paddle.x;}
      }
   }
   
   /*--------------------------------------------------------  COLLISION HANDLERS   ------------------------------------------------------*/
   //Called on every collision between the ball and the paddle
   function ballHitPaddle(ball, paddle){
      if(!stickyBall){
         // angle from vertical in degrees (left:-90, up:0, right:90)
         var deflectAngle = (ball.x - paddle.x) / ((paddle.width + ball.width)/2.0) * maxPaddleDeflectAngle;
         var ballSpeed = ball.body.velocity.getMagnitude();
         ball.body.velocity.x = ballSpeed * Math.sin(deflectAngle*Math.PI/180);
         ball.body.velocity.y = -ballSpeed * Math.cos(deflectAngle*Math.PI/180); 
         console.log("Hit paddle -> " + ball.body.velocity.getMagnitude());
      }
   }
   
   //Called on every collision between the ball and the brick
   function ballHitBrick(ball, brick){
      // This check was added to ensure a brick doesn't trigger collision twice
      if(brick!=lastKilledBrick){
         lastKilledBrick = brick;
         scaleKillSprite(brick);
         score += 1;
         lvlScore+=1;
         scoreText.setText('Points: '+score);
         // Limit velocity changes from moving bricks; Gradually increase ball velocity throughout each level
         if(lvlScore%Math.floor(lvlPass/4)==0 || lastBallVelocity*1.05<ball.body.velocity.getMagnitude()){
            ball.body.velocity.setMagnitude(lastBallVelocity*1.05);
         } else {
            ball.body.velocity.setMagnitude(Math.max(ball.body.velocity.getMagnitude(), initialBallSpeed*gameSpeed));
         } 
         lastBallVelocity = ball.body.velocity.getMagnitude();
         console.log("Hit brick  -> " + ball.body.velocity.getMagnitude());
         if(lvlScore == lvlPass){
            // all bricks cleared
            levelCleared();
         }
      }
   }
   
   function levelCleared(){
      alert('Level '+level+' clear!');
      if(!finalLevel){
         level++;
         lvlScore = 0;//re init lvlScore for next level
         lvlPass = 0;//re init lvlPass
         //remove any remaining bricks (shouldn't be any) and barriers
         bricks.forEach(function(brick){if(brick.alive){brick.kill();}});
         barriers.forEach(function(barrier){barrier.kill();});
         bricks = null;
         barriers = null;
         initBricks(level);
         // Increase game speed each level
         gameSpeed *= 1.085;
         prepareBallForShot();
      } else {
         alert("You cleared the final level!\nWell done!");
         gameFinished();
      }
   }
    
   //End Game LOGIC
   function ballLeaveScreen(){
      lives--;
      switch(lives){
         case 2:
            scaleKillSprite(heart3);
            prepareBallForShot();
            break;
         case 1:
            scaleKillSprite(heart2);
            prepareBallForShot();
            break;
         case 0:
            scaleKillSprite(heart1);
            alert('GAME OVER!');
            gameFinished();
      }
   }
   
   function gameFinished(){
      $.post("./saveScore.php", {score: score}, function(response, status){
         alert(response);
         location.reload();
      });
   }
   
   function prepareBallForShot(){
      ball.reset(game.world.width*0.5, game.world.height-25);
      paddle.reset(game.world.width*0.5, game.world.height-5);
      lastBallVelocity = undefined;
      stickyBall=true;
      game.input.onDown.addOnce(function(){
         shootTowardMouse(initialBallSpeed* gameSpeed);
         stickyBall = false;
         lastBallVelocity = ball.body.velocity.getMagnitude();
      });
   }
   
   function shootTowardMouse(speed){
      var xDiff = game.input.x - ball.x;
      var yDiff = game.input.y - ball.y;
      var scalar = speed/Math.sqrt(xDiff*xDiff+yDiff*yDiff);
      ball.body.velocity.set(xDiff*scalar, yDiff*scalar);
   }
   //animate fade out for a given sprite (object)
   function scaleKillSprite(obj){
      var killTween = game.add.tween(obj.scale);
      killTween.to({x:game.world.width*0.5,y:game.world.heigh*0.5}, 200, Phaser.Easing.Linear.None);
      killTween.onComplete.addOnce(function(){
         obj.kill();
      },this);
      killTween.start();
   }
</script>
</body>
</html>