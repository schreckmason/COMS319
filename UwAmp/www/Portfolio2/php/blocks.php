<!DOCTYPE html>
<html>
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
    var speed = 4;
    var paddle;
    //Handle creation of brick objects
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
    var level=5;
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
        
        
        game.load.image('ball', '../img/testBall.png');//load the sprite of our game object this will be changed to make a better game project
        game.load.image('paddle','../img/testpaddle.png');//load the paddle, this should once again change to something cooler
        // game.load.image('paddle','../img/newBar.png');
        game.load.image('brick', '../img/testbrick.png');
        game.load.image('barrier', '../img/testbarrier.png');
        game.load.image('heart', '../img/heart.png');
    }
    
    //executed once all assets are lodaed and ready
    function create() {
       game.physics.startSystem(Phaser.Physics.ARCADE);
       ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
       ball.anchor.set(0.5);
       game.physics.enable(ball, Phaser.Physics.ARCADE);
       ball.body.velocity.set(150, -150);
       ball.body.collideWorldBounds = true;
       ball.body.bounce.set(1);

       paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
       paddle.anchor.set(0.5,1);
       game.physics.enable(paddle, Phaser.Physics.ARCADE);
       paddle.body.collideWorldBounds = true;
       paddle.body.immovable = true;
       initBricks(level);
       
       //Game Over Logic
       ball.events.onOutOfBounds.add(ballLeaveScreen, this);
       game.physics.arcade.checkCollision.down = false;
       ball.checkWorldBounds = true;
       //Game Score
       scoreText = game.add.text(5,5, 'Points: 0',{font: '18px Arial', FILLD: '#0095DD'});
       //Life Alert
       heart1 = game.add.sprite(game.world.width-200,0,'heart');
       heart2 = game.add.sprite(game.world.width-200,160, 'heart');
       heart3 = game.add.sprite(game.world.width-200, 320, 'heart');
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
    
    function placeBlocks(groupDetails){
        
         console.log(groupDetails);
        for(r=0;r<groupDetails.rows; r++){
            for(c=0; c<groupDetails.cols; c++){
               //Set x value of block
               var groupWidth = groupDetails.cols*groupDetails.width + (groupDetails.cols-1)*groupDetails.padding;
               var anchor = groupDetails.hAlign; //left/right/center
               var groupHorizontalOffset = (anchor=="left"?0:((game.world.width - groupWidth)/(anchor=="right"?1.0:2.0))) + groupDetails.hOffset;
               var brickX = groupHorizontalOffset + c * (groupDetails.width + groupDetails.padding);
               console.log({groupWidth:groupWidth,
                            groupHorizontalOffset:groupHorizontalOffset,
                            gameWorldWidth:game.world.width,
                            brickX:brickX});
               //Set y value of block
               var brickY = r*(groupDetails.height+groupDetails.padding) + groupDetails.vOffset;
                newBrick = game.add.sprite(brickX, brickY, 'brick');
                newBrick.anchor.set(0);
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                //Set special brick properties
                    console.log(groupDetails.type);
                switch(groupDetails.type){
                    case "move1":
                        newBrick.body.velocity.set(200,0);
                        newBrick.body.collideWorldBounds=true;
                        newBrick.body.bounce.set(1);
                        bricks.add(newBrick);
                        break;
                    case "barrier":
                        newBrick.loadTexture('barrier');
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
        // game.physics.arcade.collide(ball, barriers);
        //Note might need to eventually eliminate the possibility of having multiple keys pressed simultaneously
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            //ball.x -= speed;
            paddle.x -=speed;
        //    ball.angle = -15;//will only matter for aimation of detailed objects
        }else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            paddle.x += speed;
        }else{
            
        }
    }
    
    /*--------------------------------------------------------  COLLISION HANDLERS  ------------------------------------------------------*/
    //Called on every collision between the ball and the paddle
    function ballHitPaddle(ball, paddle){
        ball.body.velocity.x = -1*5*(paddle.x-ball.x);
    }
    
    //Called on every collision between the ball and the brick
    function ballHitBrick(ball, brick){
        scaleKillSprite(brick);
        
        score += 1;
        lvlScore+=1;
        scoreText.setText('Points: '+score);
        
        if(lvlScore == lvlPass){
            // all bricks cleared
            levelCleared();
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
            ball.reset(game.world.width*0.5, game.world.height-25);
            paddle.reset(game.world.width*0.5, game.world.height-5);
            game.input.onDown.addOnce(function(){
                ball.body.velocity.set(150,-150);
            },this);
         }
     }
     
    //End Game LOGIC
    function ballLeaveScreen(){
        lives--;
        switch(lives){
            case 2:
                scaleKillSprite(heart3);
                ball.reset(game.world.width*0.5, game.world.height-25);
                paddle.reset(game.world.width*0.5, game.world.height-5);
                game.input.onDown.addOnce(function(){
                    ball.body.velocity.set(150,-150);
                },this);
                break;
            case 1:
                scaleKillSprite(heart2);
                ball.reset(game.world.width*0.5, game.world.height-25);
                paddle.reset(game.world.width*0.5, game.world.height-5);
                game.input.onDown.addOnce(function(){
                    ball.body.velocity.set(150,-150);
                },this);
                break;
            case 0:
                scaleKillSprite(heart1);
                //POST SCORE TO USER HERE
                alert('GAME OVER SCRUB');
                location.reload();
        }
    }
    
    //animate fade out for a given sprite (object)
    function scaleKillSprite(obj){
       console.log("scaleKillSprite");
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