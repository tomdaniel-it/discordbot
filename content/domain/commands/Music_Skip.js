var playlist = require('../Playlist.js');
var genericfunctions = require('../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var serverid = command.getMessage().guild.id.toString();

        if(serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        try{
            playlist.skip(serverid);
            return;
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
            return;
        }
    }
};