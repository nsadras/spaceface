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
    this.kills = 0;
    this.hits = 0;
    this.deaths = 0;

    //Badly named private variables
    this.horiz_velocity = new Vector(0,0, constants.maxPlayerVelocity); //INVARIANT: this.horiz_velocity.y==0
    this.vert_velocity = new Vector(0,0,0); //INVARIANT: this.horiz_velocity.x,z==0

    this.controls={dist:0.0,shoot:false,displacement_x:0.0,displacement_y:0.0,triple:true};

    function speed_boost(proximity){
        var boost = .001;
        if(proximity < -40){
            return boost;
        } else if(proximity < 40){
            return boost + .5 + proximity/80;
        } else {
            return 1;
        }
    }

    //Member functions
    this.update = function() {
        var rotationAngle = constants.maxPlayerRotation*this.controls.displacement_x;
        this.horiz_velocity = new Vector(
                this.horiz_velocity.x*Math.cos(rotationAngle)-this.horiz_velocity.z*Math.sin(rotationAngle),
                0,
                this.horiz_velocity.x*Math.sin(rotationAngle)+this.horiz_velocity.z*Math.cos(rotationAngle)
                )
        this.vert_velocity = new Vector(0,constants.maxPlayerVertVelocity*this.controls.displacement_y,0)
        this.velocity = Vector.vfns.scale(Vector.vfns.add(this.horiz_velocity,this.vert_velocity),3*speed_boost(-this.controls.dist));
        this.position = Vector.vfns.add(this.position, this.velocity);
        console.log(speed_boost(-this.controls.dist));
        //Bullet logic
        if (this.controls.shoot && this.reload==0){
            this.bullets.push(new Bullet(this.position,this.velocity,this.sessionKey));

            if (this.controls.triple) {
                var u1 = Vector.vfns.scale(Vector.vfns.unitVector(new Vector(-this.velocity.z, 0, this.velocity.x)), .75);
                var u2 = Vector.vfns.scale(Vector.vfns.unitVector(new Vector(this.velocity.z, 0, -this.velocity.x)), .75);

                var deflection = .5*Math.sin(this.controls.displacement_x*Math.PI/2);

                var disp1 = Vector.vfns.add(this.position, Vector.vfns.add(u1,new Vector(0,-deflection,0)));
                var disp2 = Vector.vfns.add(this.position, Vector.vfns.add(u2,new Vector(0,deflection,0)));

                this.bullets.push(new Bullet(disp1, this.velocity, this.sessionKey));
                this.bullets.push(new Bullet(disp2, this.velocity, this.sessionKey));
            }
            while (this.bullets.length>constants.maxBullets){
                this.bullets=this.bullets.slice(1);
            }
            this.reload+=1;
        }
        if (this.reload!=0){
            if (this.controls.triple) {
                this.reload=(this.reload+1)%constants.reloadTriple;
            } else {
                this.reload=(this.reload+1)%constants.reload;
            }
        }
        for (var i = 0; i < this.bullets.length; i++){
            this.bullets[i].update();
            for (sessionKey in gameState.players) {
                if(sessionKey == this.sessionKey){
                    continue;
                }
                if (Vector.vfns.distance(this.bullets[i].position, gameState.players[sessionKey].position) < constants.hitRadius) {
                    this.hits++;
                    gameState.players[sessionKey].health--;
                    this.bullets.splice(i, 1);
                    if(gameState.players[sessionKey].health <= 0 ){
                        gameState.players[sessionKey].deaths++;
                        gameState.players[sessionKey].health = constants.maxHealth;
                        gameState.players[sessionKey].position = new Vector(Math.random()*1000-500, Math.random()*1000-500, Math.random()*1000-500);
                        this.kills++;
                    }
                    i--;
                    break;
                }
            }
        }
        console.log(this.health);
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
