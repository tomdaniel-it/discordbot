const connection = null;
module.exports = {
    execute: function(command){
        var message = command.getMessage();
        if (!message.guild){
            require('../../domain/GenericFunctions.js').sendErrorMessage(command, "You must be in a voice channel to use that command.");
            return;
        }
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            const ytdl = require('ytdl-core');
            const streamOptions = { seek: 0, volume: 1 };
            if(connection === null){
                message.member.voiceChannel.join()
                .then(connection => { // Connection is an instance of VoiceConnection
                    const stream = ytdl(command.getParameters()[0].value, { filter : 'audioonly' });
                    const dispatcher = connection.playStream(stream, streamOptions);
                    message.channel.send("I'll play that for you.");
                    message.delete();
                })
                .catch(console.log);
            }else{
                console.log("connection already exists");
            }
        } else {
            require('../../domain/GenericFunctions.js').sendErrorMessage(command, "You must be in a voice channel to use that command.");
            return;
        }

    }
};