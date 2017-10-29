var genericfunctions = require('../GenericFunctions.js');
var playlist = require('../Playlist.js');

module.exports = {
    execute: function(command){
        var serverid = command.getMessage().guild.id.toString();

        if(serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        var amount = null;
        var params = command.getParameters();
        if(params!==null && params.length !== 0 && params[0] !== null && params[0].key === "amount"){
            amount = Number(params[0].value);
            if(isNaN(amount)){
                genericfunctions.sendErrorMessage(command, "-amount must be a number.");
                return;
            }
        }

        try{
            playlist.purge(serverid, amount);
            genericfunctions.sendErrorMessage(command, "Purged playlist.");
            return;
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
            return;
        }
    }
};