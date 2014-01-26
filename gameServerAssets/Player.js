var Vector = require('./Vectors.js').Vector;
var Bullet = require('./Bullet.js').Bullet;
var constants = require('./constants.js').constants;
function Player(sessionKey, gameState) {

    //Init params
    this.sessionKey = sessionKey;
    this.gameState = gameState;
    this.position = new Vector(0, 0, 0);
    this.velocity = new Vector(0, 0, 0);
    this.bullets = [];
    this.reload = 0;
    this.health = constants.maxHealth;

    //Badly named private variables
    this.horiz_velocity = new Vector(0,0, constants.maxPlayerVelocity); //INVARIANT: this.horiz_velocity.y==0
    this.vert_velocity = new Vector(0,0,0); //INVARIANT: this.horiz_velocity.x,z==0

    this.controls={shoot:false,displacement_x:0.0,displacement_y:0.0};

    //Member functions
    this.update = function() {
        var rotationAngle = constants.maxPlayerRotation*this.controls.displacement_x;
        this.horiz_velocity = new Vector(
                this.horiz_velocity.x*Math.cos(rotationAngle)-this.horiz_velocity.z*Math.sin(rotationAngle),
                0,
                this.horiz_velocity.x*Math.sin(rotationAngle)+this.horiz_velocity.z*Math.cos(rotationAngle)
                )
        this.vert_velocity = new Vector(0,constants.maxPlayerVertVelocity*this.controls.displacement_y,0)
        this.velocity = Vector.vfns.add(this.horiz_velocity,this.vert_velocity);
        this.position = Vector.vfns.add(this.position, this.velocity);

        //Bullet logic
        if (this.controls.shoot && this.reload==0){
            this.bullets.push(new Bullet(this.position,this.velocity,this.sessionKey));
            if (this.bullets.length>constants.maxBullets){
                this.bullets=this.bullets.slice(1);
            }
            this.reload+=1;
            console.log(this.bullets.length);
        }
        if (this.reload!=0){
            this.reload=(this.reload+1)%constants.reload;
        }
        for (var i = 0; i < this.bullets.length; i++){
            this.bullets[i].update();
            for (sessionKey in gameState.players) {
                if (Vector.vfns.distance(this.bullets[i].position, gameState.players[sessionKey].position) < constants.hitRadius) {
                    gameState.players[sessionKey].health--;
                    this.bullets.splice(i, 1);
                }
            }
        }
    }

    this.digest = function() {
        bulletDigest = [];
        for (var i = 0; i < this.bullets.length; i++){
            bulletDigest.push(this.bullets[i].digest());
        }
        return {
            px:this.position.x,
            py:this.position.y,
            pz:this.position.z,
            vx:this.velocity.x,
            vy:this.velocity.y,
            vz:this.velocity.z,
            roll:this.controls.displacement_x*Math.PI/2,
            bullets:bulletDigest,
        };
    }
}

exports.Player=Player;
