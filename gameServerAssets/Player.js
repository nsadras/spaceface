var Vector = require('./gameServerAssets/Vector.js');
function Player() {
    this.position = new Vector.Vector(0, 0, 0);
    this.velocity = new Vector.Vector(0, 0, 1);
    this.acceleration = new Vector.Vector(0, 0, 0);
    this.shoot = // i don't know
    this.displacement_x = // i don't know
    this.displacement_y = // i don't know
    this.update = function() {
        // acceleration update
        var v_angles = this.velocity.getAngle();
        var v_theta = v_angles.xz;
        if (Math.abs(v_theta) < 0.0001) {
            var normal = new Vector.Vector(0, 1, 0);
        } else {
            var n_theta = v_theta + Math.PI / 2;
            var v_phi = v_angles.xy;
            if (v_theta > 0) {
                var n_phi = v_phi + Math.PI;
            } else {
                var n_phi = v_phi;
            }
            y = Math.sin(n_theta);
            x = y * Math.cos(n_phi) / Math.tan(n_theta);
            z = y * Math.sin(n_phi) / Math.tan(n_theta);
            var normal = new Vector.Vector(x, y, z);
        }
        var basis2 = Vector.cross(normal, this.velocity);
        basis2 = Vector.normalize(basis2);
        this.acceleration = Vector.add(Vector.scale(normal, this.displacement_x), Vector.scale(basis2, this.displacement_y));
        this.velocity = Vector.add(this.velocity, this.acceleration);
        this.position = Vector.add(this.position, this.velocity);
    }
    this.digest = function() {
        var angles = this.velocity.getAngle();
        return {
            px:this.position.x,
            py:this.position.y,
            pz:this.position.z,
            vx:this.velocity.x,
            vy:this.velocity.y,
            vz:this.velocity.z,
            roll:0,
        };
    }
}
exports.Player=Player;
