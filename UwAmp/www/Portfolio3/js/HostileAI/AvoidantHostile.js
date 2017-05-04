//This Hostile Drives to avoid bullets
var avoidantHostile = {
   update: function() {
      // Automatically called by World.update
      // put any AI logic in here
      if(this.alive){
         this.shootAt(this.target);//shoot as fast as msPerFire will allow
         
         // Track target with cannon
         this.cannon.rotation = this.game.physics.arcade.angleBetween(this, this.target);
         
         // Run from bullets
         this.chooseDriveDirection();
         this.drive(this.driveDirection);
      }
   },
   chooseDriveDirection: function(){
      if (game.time.now > this.turnTime)
      {
         var prevDirection = this.driveDirection;
         var threats = this.findThreats();
         if(threats.length !== 0){
            var closestThreat = this.findClosestThreat(threats);
            console.log(closestThreat);
            if(this.avoidanceDirection == 0){
               this.avoidanceDirection = closestThreat.avoidanceDirection
            }
            var towardBullet = this.directionToward(closestThreat.bullet);
            this.driveDirection = (towardBullet - 3*this.avoidanceDirection + 8)%8;
         } else {
            var distFromTarget = game.physics.arcade.distanceBetween(this.target, this);
            this.driveDirection = (this.directionToward(this.target)+(distFromTarget<150?2:0))%8;
            this.avoidanceDirection = 0;
         }
         if(prevDirection != this.driveDirection){
            this.turnTime = game.time.now + 100;
         }
      }
   },
   findThreats: function(){
      var threats = [];
      allBullets.forEach(function(bullet) {
         if(bullet.alive){
            //angle in radians from the bullet to this tank
            var bulletToTank = game.physics.arcade.angleBetween(bullet, this);
            //bullet's trajectory in radians
            var bulletTraj = helpers.trajectory(bullet);
            //angle in radians which the bullet would have to turn to head toward this tank
            var trajOffset =  helpers.normRad(bulletToTank - bulletTraj);
            //distance from this tank to the bullet
            var bulletDist = game.physics.arcade.distanceBetween(bullet, this);
            //distance at which bullet will pass tank
            var passDist = Math.abs(Math.sin(trajOffset) * bulletDist);
            if(Math.abs(trajOffset) < (Math.PI/2) && passDist < this.width*1.5){
               // THREAT: bullet aimed to pass by tank at close distance
               threats.push({
                  bullet: bullet,
                  distance: bulletDist,
                  avoidanceDirection: Math.sign(trajOffset)
               });
            }
         }
      }, this);
      return threats;
   },
   findClosestThreat: function(threats){
      var closestThreat = undefined;
      var minDistance = undefined;
      threats.forEach(function(threat) {
         if(minDistance === undefined || threat.distance < minDistance){
            minDistance = threat.distance;
            closestThreat = threat;
         }
      }, this);
      return closestThreat;
   },
   init: function(){
      //Attach helper functions
      this.chooseDriveDirection = avoidantHostile.chooseDriveDirection;
      this.findClosestThreat = avoidantHostile.findClosestThreat;
      this.findThreats = avoidantHostile.findThreats;
      
      //Always shoot at player
      this.target = playerTank;
      
      // Drive toward
      this.driveDirection = 0;
      this.turnTime = 0;
      this.avoidanceDirection = 0; //1:CW ; -1:CCW ; 0:NONE
  }
};