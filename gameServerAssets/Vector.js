Vector=function (x,y,z){
    this.x=x;
    this.y=y;
    this.z=z;
    this.getAngle = function(){
        return {
            'xy':Math.atan(this.z,Math.sqrt(this.x*this.x+this.y*this.y)),
            'yz':Math.atan(this.x,Math.sqrt(this.y*this.y+this.x*this.x)),
            'xz':Math.atan(this.y,Math.sqrt(this.x*this.x+this.z*this.z)),
        };
    }
    this.norm = function(){
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
    }
}
add=function(u,v){
    return new Vector(u.x+v.x,u.y+v.y,u.z+v.z);
}
sub=function(u,v){
    return new Vector(u.x-v.x,u.y-v.y,u.z-v.z);
}
dot=function(u,v){
    return u.x*v.x+u.y*v.y+u.z*v.z;
}
scale=function(v,c){
    return new Vector(v.x*c,v.y*c);
}
unitVector=function(v){
    return scale(v,1.0/v.norm());
}

exports.Vector=Vector;
exports.add=add;
exports.sub=sub;
exports.dot=dot;
