var genericfunctions = require('../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var message = command.getMessage();
        if (!message.guild){
            genericfunctions.sendErrorMessage(command, "You must be in a voice channel to use that command.");
            return;
        }
        var langcode = "en";
        var params = command.getParameters();
        
        // Only try to join the sender's voice channel if they are in one themselves
        if(params.length!==1){
            var lang = (params[0].key==="lang"?params[0].value:params[1].value);
            switch(lang.toLowerCase().trim()){
                case "english":
                    langcode = "en";
                    break;
                case "french":
                    langcode = "fr-FR";
                    break;
                case "dutch":
                    langcode = "nl-NL";
                    break;
                case "german":
                    langcode = "de-DE";
                    break;
                case "korean":
                    langcode = "ko-KR";
                    break;
                case "russian":
                    langcode = "ru-RU";
                    break;
                case "italian":
                    langcode = "it-IT";
                    break;
                case "spanish":
                    langcode = "es-AR";
                    break;
                default:
                    return;
            }
        }
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
                var googleTTS = require('google-tts-api');
                
                googleTTS(command.getParameters()[0].value, langcode, 1)   // speed normal = 1 (default), slow = 0.24
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