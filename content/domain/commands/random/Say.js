var genericfunctions = require('../../GenericFunctions.js');
var playlist = require('../../Playlist.js');

module.exports = {
    execute: function(command){
        var message = command.getMessage();
        var serverid = command.getMessage().guild.id;
        if (!message.guild || serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "You must be in a voice channel to use that command.");
            return;
        }
        var langcode = "en";
        var langs = [["english", "en"],["french", "fr-FR"],["dutch", "nl-NL"],["german", "de-DE"],["korean", "ko-KR"],["russian", "ru-RU"],["italian", "it-IT"],["spanish", "es-AR"]];
        var params = command.getParameters();

        //SETTING LANGCODE IF SET
        var firstparam = params.split(" ")[0];
        var lastparam = params.split(" ")[params.split(" ").length-1];
        for(var i=0;i<langs.length;i++){
            if(firstparam.toLowerCase().trim() === langs[i][0]){
                langcode = langs[i][1];
                params = params.substring(params.split(" ")[0].length+1);
                break;
            }
            if(lastparam.toLowerCase().trim() === langs[i][0]){
                langcode = langs[i][1];
                params = params.substring(0, params.length - params.split(" ")[params.split(" ").length-1].length-1);
                break;
            }
        }        

        //CHECK IF MUSICBOT IS PLAYING, IF SO, CANCEL
        if(playlist.isPlaying(serverid)){
            genericfunctions.sendErrorMessage(command, "You can't use this command whilst I am playing music.");
            return;
        }

        if(params.length > 199){
            genericfunctions.sendErrorMessage(command, "Text length should be less than 200 characters.");
            return;
        }

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
                var googleTTS = require('google-tts-api');
                
                googleTTS(params, langcode, 1)   // speed normal = 1 (default), slow = 0.24
                .then(function (url) {
                    const streamOptions = { seek: 0, volume: 1 };
                    const dispatcher = connection.playStream(url, streamOptions);
                    dispatcher.on('end',()=>{
                        message.member.voiceChannel.leave();
                    });
                })
                .catch(function (err) {
                  console.error(err.stack);
                });
                
                
            })
            .catch(console.log);
        } else {
            genericfunctions.sendErrorMessage(command, "You must be in a voice channel to use that command.");
            return;
        }
    }
};