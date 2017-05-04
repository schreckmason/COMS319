var testHostile = {
   update: function() {
      // Automatically called by World.update
      // put any AI logic in here
      if(this.alive){
         this.shootAt(this.target);//shoot as fast as msPerFire will allow
         
         // Track target with cannon
         this.cannon.rotation = this.game.physics.arcade.angleBetween(this, this.target);
         
         // JIKL Movement
         if(game.input.keyboard.isDown(Phaser.Keyboard.J)){this.x-=this.driveSpeed;}
         else if(game.input.keyboard.isDown(Phaser.Keyboard.L)){this.x+=this.driveSpeed;}
         else if(game.input.keyboard.isDown(Phaser.Keyboard.I)){this.y-=this.driveSpeed;}
         else if(game.input.keyboard.isDown(Phaser.Keyboard.K)){this.y+=this.driveSpeed;}
      }
   },
   init: function(){
      this.target = playerTank;
   }
};