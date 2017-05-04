function createTank(initFunc, updateFunc, properties){
   if(properties === undefined){properties = {};}
   
   //defaults
   var tankProperties = {
      driveSpeed: 2,
      health: 1,
      bulletSpeed: 150,
      reloadDelay: 500,
      xPos: "random",
      yPos: "random",
      style: "hostile"
   };
   
   //merge default properties with set properties
   Object.keys(properties).forEach(function(key) {
      tankProperties[key] = properties[key];
   });
   
   if(tankProperties.xPos === "random")
      {tankProperties.xPos = game.world.randomX;}
   if(tankProperties.yPos === "random")
      {tankProperties.yPos = game.world.randomY;}
   
   var tank = new Tank(tankProperties);
   tank.update = function(){
      updateFunc.call(this);
      Tank.prototype.update.call(this);//call generic update function
   };
   initFunc.call(tank);//initialize properties
   return tank;
}

Tank = function (props) {
   console.log(props);
   
   Phaser.Sprite.call(this, game, props.xPos, props.yPos, props.style+'_tank');
   game.add.existing(this);
   allTanks.push(this);
   this.anchor.setTo(0.5, 0.5);
   game.physics.enable(this, Phaser.Physics.ARCADE);
   this.body.collideWorldBounds = true;
   
   this.driveSpeed = props.driveSpeed;
   this.health = props.health;
   this.bulletSpeed = props.bulletSpeed;
   this.reloadDelay = props.reloadDelay;
   
   this.cannon = game.make.sprite(0, 0, props.style+'_cannon')
   this.cannon.anchor.setTo(0.3,0.5);
   this.addChild(this.cannon);
   
   this.bullets = game.add.group();
   this.bullets.enableBody = true;
   this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
   this.bullets.createMultiple(30, 'bullet', 0, false);
   this.bullets.setAll('anchor.x', 0.5);
   this.bullets.setAll('anchor.y', 0.5);
   this.bullets.setAll('outOfBoundsKill', true);
   this.bullets.setAll('checkWorldBounds', true);
   this.leavingChamber = [];//can't collide with bullets being fired
   this.reloadTime = 0;//time at which to reload
   //add bullets to global array
   allBullets = allBullets.concat(this.bullets.children);
};

//Extend Sprite
Tank.prototype = Object.create(Phaser.Sprite.prototype);
Tank.prototype.constructor = Tank;

Tank.prototype.update = function(){
   for (var i=this.leavingChamber.length-1; i>=0; i--)
   {
      if(!game.physics.arcade.overlap(this, this.leavingChamber[i])){
         this.leavingChamber.splice(i, 1); //remove bullets that have left the chamber
      }
   }
}

Tank.prototype.drive = function(direction){
   var diagMult = 0.7071;// leg length of a 45, 45, 90 triangle with hypotenuse 1
   switch(direction){
      case 'r':
      case 0:
         this.x += this.driveSpeed;
      break;
      case 'dr':
      case 1:
         this.x += this.driveSpeed * diagMult;
         this.y += this.driveSpeed * diagMult;
      break;
      case 'd':
      case 2:
         this.y += this.driveSpeed;
      break;
      case 'dl':
      case 3:
         this.y += this.driveSpeed * diagMult;
         this.x -= this.driveSpeed * diagMult;
      break;
      case 'l':
      case 4:
         this.x -= this.driveSpeed;
      break;
      case 'ul':
      case 5:
         this.x -= this.driveSpeed * diagMult;
         this.y -= this.driveSpeed * diagMult;
      break;
      case 'u':
      case 6:
         this.y -= this.driveSpeed;
      break;
      case 'ur':
      case 7:
         this.y -= this.driveSpeed * diagMult;
         this.x += this.driveSpeed * diagMult;
      break;
      
      case '':
      case 8:
      default: //don't move
      break;
   }
}

Tank.prototype.shootAt = function(target){
   if (game.time.now > this.reloadTime && this.bullets.countDead() > 0)
   {
      var bullet = this.bullets.getFirstExists(false);
      bullet.reset(this.x, this.y);//position bullet at tank
      this.leavingChamber.push(bullet);
      bullet.rotation = game.physics.arcade.moveToXY(bullet, target.x, target.y, this.bulletSpeed);//fire
      this.reloadTime = game.time.now + this.reloadDelay;// set next fire time
   }
};

Tank.prototype.directionToward = function(target){
   var angle = game.physics.arcade.angleBetween(this, target); // radians (-pi, +pi)
   return Math.round(4*angle/Math.PI + 8) % 8; //convert angle to new system (0: right) ->(counter-clockwise)-> (7: up-right)
};