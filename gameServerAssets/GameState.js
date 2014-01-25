Player = require('./Player.js').Player;
function GameState(){
    this.players={} //Hash of players

    //pointless comment
    
    this.addPlayer = function(sessionKey){
        this.players[sessionKey] = new Player(); //TODO: Update to match player constructor
    }

    this.removePlayer = function(sessionKey){
        delete this.players[sessionKey];
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
        if (sessionKey in this.players){
            this.players[sessionKey].controls=controls;
        }
    }

}
exports.GameState = GameState;
