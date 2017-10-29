var genericfunctions = require('../GenericFunctions.js');
var playlist = require('../Playlist.js');

module.exports = {
    execute: function(command){
        var channel = command.getMessage().member.voiceChannel;
        var serverid = command.getMessage().guild.id;
        if(channel===undefined || channel===null || serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "You need to be in a voice channel to use this command.");
            return;
        }
        try{
            var listener = playlist.play(serverid, channel);
            listener.on('newsong', song=>{
                command.getMessage().channel.send("Now playing: " + song.title + " (" + song.duration + ")");
            });
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
        }
    }
};