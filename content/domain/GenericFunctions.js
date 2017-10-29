module.exports = {
    sendErrorMessage: function(command, content){
        var timeUntilDeletion = require('../../settings.js').error_message_time_until_deletion; //IN SECONDS
        var errorMessageAttachment = " (deleting message in " + timeUntilDeletion + " seconds...)";
        content += (command.getMessage().deletable?errorMessageAttachment:"");
        command.getMessage().channel.send(content).then(message => 
            setTimeout(function(){
                setTimeout(function(){
                    if(message.deletable)
                        message.delete();
                }, 1);
                setTimeout(function(){
                    if(command.getMessage().deletable)
                        command.getMessage().delete();
                }, 1);
            }, timeUntilDeletion*1000)
        );
    },
    deleteMessage: function(message){
        if(message.deletable)
            message.delete();
    },
    sendMessage: function(command, content){
        return command.getMessage().channel.send(content);
    }
}