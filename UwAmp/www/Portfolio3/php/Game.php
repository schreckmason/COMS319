<html>
<head>
<script src="../js/phaser.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
</head>
<body>
<script src="../js/HelperFunctions.js" ></script>
<script src="../js/HostileAI/TestHostile.js" ></script>
<script src="../js/HostileAI/StrangeHostile.js" ></script>
<script src="../js/HostileAI/AvoidantHostile.js" ></script>
<script src="../js/PlayerTank.js" ></script>
<script src="../js/Tank.js" ></script>
<script>
/*****************************************/
/*           GLOBAL GAME VARS            */
/*****************************************/
//      -----minimize global variables----
var game;
var background; //type of terrain
var playerTank;
var hostiles; //sprite group of hostiles
var allBullets; //array of all bullets
var allTanks; //array of all tanks
var hostileAIs = //init functions, update functions, and properties for each AI

/*****************************************/
/*               GAME INIT               */
/*****************************************/
game = new Phaser.Game(800,500,Phaser.AUTO,null,{
preload: preload, create: create, update: update
});

//Preload assets
function preload(){
   
   //SETS THE TERRAIN FROM THE ASSETS FOLDER
   game.load.image('terrain', '../assets/light_grass.png');

   //game.load.atlas will need to be used to add a tank texture later
   //REPLACE ME WITH CUSTOM TANK
   //name image keys as: "<style>_tank" and "<style>_cannon"
   game.load.image('player_tank','../assets/tank1.png');
   game.load.image('player_cannon','../assets/cannon1.png');
   game.load.image('hostile_tank','../assets/tank2.png');
   game.load.image('hostile_cannon','../assets/tank2cannon.png');
   //REPLACE ME WITH CUSTOM BULLET
   game.load.image('bullet','../assets/bullet.png');
}

/*****************************************/
/*             AI DEFINITIONS            */
/*****************************************/
function createHostilesAIs(){
   hostileAIs = {
      test: [
         testHostile.init, 
         testHostile.update, 
         {
            style:"hostile",
            health:5,
            xPos:"random",
            yPos:"random",
            reloadDelay:2000
         }
      ],
      avoidant: [
         avoidantHostile.init, 
         avoidantHostile.update, 
         {
            driveSpeed:2,
            health:10,
            reloadDelay: 500
         }
      ],
      strange: [
         strangeHostile.init, 
         strangeHostile.update, 
         {
            style:"hostile",
            health:3,
            xPos:"random",
            yPos:"random",
            reloadDelay:2000
         }
      ]
   };
}
/*****************************************/
/*              GAME CREATE              */
/*****************************************/
//Create loaded elements
function create(){
   //INITIALIZE THE BACKGROUND
   background = game.add.tileSprite(0,0,800,500,'terrain');
   background.fixedToCamera = true;
   
   //filled as tanks are created
   allTanks = []
   allBullets = [];
   
   //CREATE PLAYER TANK
   playerTank = createTank(function(){}, playerTankUpdate, {style:"player", health:10, reloadDelay: 1000});
   playerTank.bringToTop();
   
   //INIT AIs
   createHostilesAIs();
   
   //INIT HOSTILES
   hostiles = game.add.group();
   for(var i=0;i<1;i++){
      var enemyTank = createTank.apply(this, hostileAIs["avoidant"]);
      hostiles.add(enemyTank);//add hostile sprite to sprite group
   }
   game.world.bringToTop(hostiles);

   //SET CAMERA
   game.camera.follow(playerTank);
   // game.camera.focusOnXY(0, 0);
   
}
/*****************************************/
/*                 UPDATE                */
/*****************************************/
//Update: executed at every frame (handle player and AI movement)
function update(){
   //update method off all sprites that have been added to the game called automatically
   // game.physics.arcade.collide(playerTank, hostiles);//NOT WORKING
   game.physics.arcade.overlap(hostiles, allBullets, hostileHit, null, this);
   game.physics.arcade.overlap(playerTank, allBullets, playerHit, null, this);
   
   // console.log(findClosestBullet());
}

// findClosestBullet = function(){
   // var closestBullet = undefined;
   // var minDistance = undefined;
   // allBullets.forEach(function(bullet) {
      // if(bullet.alive){
         // var dist = game.physics.arcade.distanceBetween(bullet, playerTank);
         // console.log(dist);
         // if(minDistance===undefined || dist<minDistance){
            // minDistance = dist;
            // closestBullet = bullet;
         // }
      // }
   // });
   // // console.log(minDistance);
   // return closestBullet;
// };

//Player is hit
function playerHit(tank, bullet){
   if(tank.leavingChamber.indexOf(bullet) == -1){
      playerTank.damage(1);
      //if the bullet is one which is not leaving this tank's chamber
      bullet.kill();//bullet disappears
   }
}

//Enemy is hit
function hostileHit(bullet, hostile){
   if(hostile.leavingChamber.indexOf(bullet) == -1){
      //if the bullet isn't currently leaving this tank's chamber
      hostile.damage(1);//remove 1 hp from hostile
      bullet.kill();//bullet disappears
   }
}

//Game status text such as number of enemies, player hp, and whatever
// function utilities(){}

</script>
</body>
</html>
