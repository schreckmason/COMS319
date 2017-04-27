<html>
<head>
<!--Necessary scripts-->
<script src="../js/phaser.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
</head>
<body>
<script>
/*****************************************/
/*           HELPER FUNCTIONS            */
/*****************************************/
Enemy = function(id, game, target, bullets, behavior){
	//post to behavior.json for hp, fire rate, and name, and movement behavior 
	var that = this;
	$.post('./GetBehavior.php',{behaviorId: behavior}, function(response){
			console.log(response);
			var behaviorInfo = JSON.parse(response);
			that.hp = behaviorInfo.hp;
			that.rateOfFire = behaviorInfo.rateOfFire;
			that.name = behaviorInfo.name;
			that.speed = behaviorInfo.speed;
			});

	this.id = id;
	this.game = game;
	this.bullets = bullets;
	this.reload = 0;
	this.target = target;

	var x = game.world.randomX;
	var y = game.world.randomY;
	this.tank = game.add.sprite(x,y,'hostile');
	this.cannon = game.add.sprite(x,y,'hostileCannon');
	this.tank.anchor.set(0.5);
	this.cannon.anchor.set(0.3,0.5);

	game.physics.enable(this.tank, Phaser.Physics.ARCADE);
	this.tank.body.immovable = false;
	this.tank.body.collideWorldBounds = true;

	console.log(this);


};

//PROTOTYPE UPDATE
Enemy.prototype.update = function(){
this.tank.cannon.x = this.tank.x;
this.tank.cannon.y = this.tank.y
this.cannon.rotation = this.game.physics.arcade.angleBetween(this.tank, this.target);

};

//PROTOTYPE DAMAGE
Enemy.prototype.damage = function(){
	this.health -= 1;
	if(this.health<=0){
		this.cannon.kill();
		this.tank.kill();
		return true;
	}
	return false;
};



/*****************************************/
/*               GAME INIT               */
/*****************************************/
var game = new Phaser.Game(800,500,Phaser.AUTO,null,{
preload: preload, create: create, update: update
});

//Preload assets
function preload(){
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;

	//SETS THE TERRAIN FROM THE ASSETS FOLDER
	game.load.image('terrain', '../assets/light_grass.png');

	//game.load.atlas will need to be used to add a tank texture later
	//REPLACE ME WITH CUSTOM TANK
	game.load.image('tank','../assets/tank1.png');
	game.load.image('cannon','../assets/cannon1.png');
	game.load.image('hostile','../assets/tank2.png');
	game.load.image('hostileCannon','../assets/tank2cannon.png');
	//REPLACE ME WITH CUSTOM BULLET
	game.load.image('bullet','../assets/bullet.png');


}
/*****************************************/
/*           GLOBAL GAME VARS            */
/*****************************************/
var totalTanks = 0;//array containing enemies
//This will be the type of terrain
var background;
//Player's Tank
var tank;
//Tank Components
var cannon;
var bullets;
var tankSpeed=2;
var fireRate=100;
var reload=0;
//Enemies
var hostileBullets;//bullets shot by hostiles
var totalHostiles;//total number of hostiles 
var liveHostiles;//number of live hostiles

//Create loaded elements
function create(){
	//INITIALIZE THE BACKGROUND
	background = game.add.tileSprite(0,0,800,500,'terrain');
	background.fixedToCamera = true;

	//INITIALIZE THE BASE OF THE 'TANK'
	tank = game.add.sprite(0,0,'tank');
	tank.anchor.setTo(0.5, 0.5);
	game.physics.enable(tank, Phaser.Physics.ARCADE);
	tank.body.drag.set(0.2);
	tank.body.collideWorldBounds = true;
	tank.body.maxVelocity.setTo(200,200);
	tank.hp = 10;
	tank.alive = true;

	//INITIALIZE THE CANNON OF THE 'TANK
	cannon = game.add.sprite(0,0,'cannon','tank');
	cannon.anchor.setTo(0.3,0.5);

	//BULLETS OF THE PLAYER'S TANK
	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(30, 'bullet', 0, false);
	bullets.setAll('anchor.x', 0.5);
	bullets.setAll('anchor.y', 0.5);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('checkWorldBounds', true);

	//ENEMY BULLET GROUP
	hostileBullets = game.add.group();
	hostileBullets.enableBody = true;
	hostileBullets.physicsBodyType = Phaser.Physics.ARCADE;
	hostileBullets.createMultiple(100, 'bullet');
	hostileBullets.setAll('anchor.x', 0.5);
	hostileBullets.setAll('anchor.y', 0.5);
	hostileBullets.setAll('outOfBoundsKill', true);
	hostileBullets.setAll('checkWorldBounds', true);

	//INIT HOSTILES
	hostiles = [];
	totalHostiles = 1;
	for(var i=0;i<totalHostiles;i++){
		hostiles.push(new Enemy(i, game, tank, hostileBullets,0));
		game.physics.enable(hostiles[i].tank, Phaser.Physics.ARCADE);
	}
	//BRING ALL OBJECTS TO TOP
	tank.bringToTop();
	cannon.bringToTop();

	game.camera.follow(tank);
	game.camera.focusOnXY(0, 0);

}
//Update: executed at every frame (handle player and AI movement)
function update(){
	if(game.input.keyboard.isDown(Phaser.Keyboard.A)){ tank.x -= tankSpeed; }
	else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){ tank.x += tankSpeed; }
	else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){ tank.y += tankSpeed; }
	else if(game.input.keyboard.isDown(Phaser.Keyboard.W)){ tank.y -= tankSpeed; }
	//FINISH THE MOVEMENTS


	cannon.x = tank.x;
	cannon.y = tank.y;
	//TACK POINTER FOR CANNON
	cannon.rotation = game.physics.arcade.angleToPointer(cannon);

	//POINTER CLICK
	if(game.input.activePointer.isDown){
		shoot();
	}

	//M to display the map of the game?

	//E to display the enemies left in the game

/*
for(var i=0;i<hostiles.length;i++){
if(hostiles[i].alive){
liveHostiles++;
game.physics.arcade.overlap(bullets, hostiles[i].tank, enemyShot, null, this);
console.log("enemies alive");
}
}
*/
//REMOVE ME and make dynamic
if(game.input.keyboard.isDown(Phaser.Keyboard.O)){hostiles[0].tank.x-= tankSpeed; }
else if(game.input.keyboard.isDown(Phaser.Keyboard.P)){hostiles[0].tank.x+=tankSpeed; }
game.physics.arcade.overlap(bullets, hostiles[0].tank, enemyShot, null, this);
}

//Player is hit
function playerShot(tank, bullet){
	bullet.kill();

}

//Enemy is hit
function enemyShot(bullets, hostile){
//change me to ecrement bot's hp
bullets.kill();
hostile.kill();
//need to kill cannon
}


//Shoot
function shoot(){
	if (game.time.now > reload && bullets.countDead() > 0)
	{
		reload = game.time.now + fireRate;
		var bullet = bullets.getFirstExists(false);
		bullet.reset(cannon.x, cannon.y);
		bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
	}
}

//Radar
function utilities(){

}

</script>
</body>
</html>
