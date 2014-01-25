exports.Vector=function (x,y,z){
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
    this.projection=function(v){
        var len=v.norm();
        if (len==0){
            return 0;
        }
        return this.dotProd(v.scale(1/len));
    }

}
exports.add=function(u,v){
    return new Vector(u.x+v.x,u.y+v.y,u.z+v.z);
}
exports.sub=function(u,v){
    return new Vector(u.x-v.x,u.y-v.y,u.z-v.z);
}
exports.dot=function(u,v){
    return u.x*v.x+u.y*v.y+u.z*v.z;
}
