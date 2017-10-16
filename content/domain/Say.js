module.exports = {
    execute: function(command){
        var message = command.getMessage();
        if (!message.guild){
            require('../domain/GenericFunctions.js').sendErrorMessage(command, "You must be in a voice channel to use that command.");
            return;
        }
        
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
                console.log(command.getParameters()[0].value);
                message.channel.send(command.getParameters()[0].value, {
                    tts: true
                }).then(val=>{
                    message.member.voiceChannel.leave();
                    
                    val.delete();
                });
            })
            .catch(console.log);
        } else {
            require('../domain/GenericFunctions.js').sendErrorMessage(command, "You must be in a voice channel to use that command.");
            return;
        }
    }
};