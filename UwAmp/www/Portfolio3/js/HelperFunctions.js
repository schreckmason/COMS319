var helpers = {
   trajectory: function(sprite){
      return (new Phaser.Point()).angle(sprite.body.velocity);
   },
   normRad: function(rad){
      return rad - 2*Math.PI*Math.floor((rad+Math.PI)/(2*Math.PI));
   }
};