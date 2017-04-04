<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Dope Ass Game</title>
    <style>* { padding: 0; margin: 0; }</style>
    <script src="../js/phaser.min.js"></script>
</head>
<body>
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
    var level=0;
    var lvlPass=0;
    var lvlScore=0;
    
    //preloads page assets
    function preload() {
        //Scale the canvas to any screen size
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        
        
        game.load.image('ball', '../img/newBall.png');//load the sprite of our game object this will be changed to make a better game project
        //game.load.image('paddle','../img/testpaddle.png');//load the paddle, this should once again change to something cooler
        game.load.image('paddle','../img/newBar.png');
        game.load.image('brick', '../img/testbrick.png');
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
        var lvlRow;
        var lvlCol;
        switch(lvl){
            case 0:
                lvlRow = 2;
                lvlCol = 1;
                break;
            case 1:
                lvlRow = 4;
                lvlCol = 2;
                break;
            case 2:
                lvlRow = 3;
                lvlCol = 1;
                break;
            case 3:
                lvlRow = 6;
                lvlCol = 3;
                break;
            case 4:
                lvlRow = 10;
                lvlCol = 4;
                break;
            case 5:
                //movement
                lvlRow = 5;
                lvlCol = 2;
        }
        brickInfo = {
            width: 50,
            height: 20,
            count: {
                row: lvlRow,
                col: lvlCol
            },
            offset: {
                top: 50,
                left: 60
            },
            padding: 10
        };
        placeBlocks(brickInfo.count.row, brickInfo.count.col, brickInfo.width, brickInfo.height,brickInfo.offset.top,brickInfo.offset.left,brickInfo.padding,level);
        lvlPass = brickInfo.count.row*brickInfo.count.col;
    }
    //Necessary, once bricks array hits a certain size the anchor location needs to change, plus will allow for movement to be incoporated
    function placeBlocks(row,col,width,height,otop,oleft,padding,lvl){
        bricks = game.add.group();
        for(c=0;c<col; c++){
            for(r=0; r<row; r++){
                var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
                var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
                newBrick = game.add.sprite(brickX, brickY, 'brick');
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                switch(lvl){
                    case 0:
                        newBrick.anchor.set(-6);
                        break;
                    case 1:
                    case 2:
                        newBrick.anchor.set(-5);
                        break;
                    case 3:
                        newBrick.anchor.set(-4);
                        break;
                    case 4:
                        newBrick.anchor.set(0.5);
                        break;
                    case 5:
                        newBrick.anchor.set(0.5);
                        moveBrix(newBrick);
                        break;
                    default:     newBrick.anchor.set(0.5);
                        break;
                }
                bricks.add(newBrick);
            }
        }
    }
    
    /*--------------------------------------------------------  MOVEMENT HANDLERS  ------------------------------------------------------*/
    
    //executed on every frame
    function update() {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle);
        game.physics.arcade.collide(ball,bricks, ballHitBrick);
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
    //bick movement
    function moveBrix(obj){
        obj.body.velocity.set(200,0);
        obj.body.collideWorldBounds=true;
        obj.body.bounce.set(1);
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
            alert('Level '+level+' clear!');
            level++;
            lvlScore = 0;//re init lvlScore for next level
            lvlPass = 0;//re init lvlPass
            bricks = null;
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