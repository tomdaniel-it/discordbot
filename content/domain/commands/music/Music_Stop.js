var genericfunctions = require('../../GenericFunctions.js');
var playlist = require('../../Playlist.js');

module.exports = {
    execute: function(command){
        var serverid = command.getMessage().guild.id;
        if(serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }
        try{
            playlist.stop(serverid);
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
        }
    }
};