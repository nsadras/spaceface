Player = function(){
    this.update=function(){console.log("player update called");};
    this.digest=function(){console.log("player digest called");};
} 
//TODO: Replace dummy with import

function GameState(){
    this.players={} //Array of players
    //pointless comment
    this.addPlayer = function(sessionKey){
        players[sessionKey] = new Player(); //TODO: Update to match player constructor
    }
    this.update=function(){
        for (sessionKey in this.players){
            this.players[sessionKey].update();
        }
    }
    this.digest=function(){
        var out = {};
        for (sessionKey in this.players){
            out[sessionKey] = this.players[sessionKey].digest();
        }
        return out;
    }
    this.setControls=function(sessionKey,controls){
        this.players[sessionKey].controls=controls;
    }
}
exports.GameState = GameState;
