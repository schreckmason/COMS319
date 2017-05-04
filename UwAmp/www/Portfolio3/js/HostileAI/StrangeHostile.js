//This Hostile Drives to avoid bullets
var strangeHostile = {
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
      // Look for bullets, dodge them
      var closestBullet = this.findClosestBullet();
      if(closestBullet!==undefined){
         var angle = game.physics.arcade.angleBetween(this, closestBullet);
         // +1/2 pi (perpendicular angle);
         // round to nearest 1/4 pi (45 degrees);
         // mod by 1 full rotation;
         // map to drive directions
         this.driveDirection = (((Math.round((angle + (Math.PI/2))*(4/Math.PI)) % 8) + 2) % 8) + 1;
      }
   },
   findClosestBullet: function(){
      var closestBullet = undefined;
      var minDistance = undefined;
      allBullets.forEach(function callback(bullet) {
         if(bullet.alive){
            var dist = game.physics.arcade.distanceBetween(bullet, this);
            if(minDistance===undefined || dist<minDistance){
               minDistance = dist;
               closestBullet = bullet;
            }
         }
      });
      return closestBullet;
   },
   init: function(){
      //Attach helper functions
      this.chooseDriveDirection = strangeHostile.chooseDriveDirection;
      this.findClosestBullet = strangeHostile.findClosestBullet;
      
      //Always shoot at player
      this.target = playerTank;
      
      // Drive toward
      this.driveDirection = 0; // 0:stationary, 1:up, 2:up-right, 3:right, 4:down-right, 5:down, 6:down-left, 7:left, 8:up-left
   }
};