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
            var list = playlist.getPlaylist(serverid); //[{title: String, duration: String}]
            if(list===null||list.length===0){
                genericfunctions.sendErrorMessage(command, "There are no songs queued in the playlist.");
                return;
            }
            var msg = "Playlist:\n```";
            for(var i=0;i<list.length;i++){
                msg += "\n" + (i+1) + ". " + list[i].title + " (" + list[i].duration + ")";
            }
            msg += "\n```";
            genericfunctions.sendMessage(command, msg);
            return;
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
            return;
        }
    }
};