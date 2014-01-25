var Vector = require('./gameServerAssets/Vector.js');
function Player(){
    this.position = new Vector.Vector(0,0,0);
    this.velocity = new Vector.Vector(0,0,0);
    this.acceleration = new Vector.Vector(0,0,0);
    this.update = function(){
        this.velocity = Vector.add(this.velocity,this.acceleration);
        this.position = Vector.add(this.position,this.velocity);
    }
    this.digest = function(){
        var angles = this.velocity.getAngle()
        return {
            x:this.position.x,
            y:this.position.y,
            z:this.position.z,
            pitch:angles.xz,
            yaw:angles.xy,
            roll:0,
        };
    }
}
exports.Player=Player;
