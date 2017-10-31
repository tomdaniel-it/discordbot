var playlist = require('../../Playlist.js');
var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var serverid = command.getMessage().guild.id.toString();

        if(serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        try{
            if(playlist.skip(serverid)){
                genericfunctions.sendErrorMessage(command, "Skipped a song.");
            }else{
                genericfunctions.sendErrorMessage(command, "There are no songs to skip.");
            }
            return;
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
            return;
        }
    }
};