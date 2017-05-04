playerTankUpdate = function() {
   // Automatically called by World.update
   
   //Shooting on click
   if(game.input.activePointer.isDown){
      this.shootAt(game.input.activePointer);
   }
   
   //Cannon Tracking Mouse
   this.cannon.rotation = game.physics.arcade.angleToPointer(this);
   
   // AWSD Movement
   var up = game.input.keyboard.isDown(Phaser.Keyboard.W);
   var down = game.input.keyboard.isDown(Phaser.Keyboard.S);
   var left = game.input.keyboard.isDown(Phaser.Keyboard.A);
   var right = game.input.keyboard.isDown(Phaser.Keyboard.D);
   var vertical = up ? (!down ? 'u' : '') : (down ? 'd' : '');
   var horizontal = right ? (!left ? 'r' : '') : (left ? 'l' : '');
   this.drive(vertical + horizontal);
};