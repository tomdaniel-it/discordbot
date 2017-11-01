var commandlist = require('../storage/commands.js');
var pollmanager = require('../domain/PollManager.js');

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
    },
    getCategoryOfCommand: function(command){
        for(var i=0;i<commandlist.length;i++){
            if(commandlist[i].command === command) return commandlist[i].category;
        }
        return null;
    },
    pollToString: function(poll){
        var content = "Poll: " + poll.name + "   Creator: " + poll.author + "\n```";
        for(var i=0;i<poll.options.length;i++){
            var option = poll.options[i];
            content += "\n" + (i+1) + ". " +option.name;
            var votecount = ( (option.votes === undefined || option.votes === null ) ? 0 : option.votes.length );
            content += " (" + votecount + " votes)";
        }
        if(poll.options.length === 0){
            content += "There are no options yet.";
            content += "\nUse '" + require('../../settings.js').command_prefix + "poll_add_option -name " + poll.name + " -option optionName' to add an option.";
            content += "\n```";
            return content;
        }
        content += "\n\nUse '" + require('../../settings.js').command_prefix + "poll_vote -name " + poll.name + " -option optionNumber' to vote.";
        content += "\n```";
        return content;
    },
    pollSendMessage: function(serverid, pollname, command){
        var name = pollname;
        var poll = pollmanager.get(serverid, name);
        var last_message = poll.last_message;
        if(last_message !== undefined && last_message !== null){
            last_message.delete().then(message=>{
                module.exports.sendMessage(command, module.exports.pollToString(poll)).then(message=>{
                    module.exports.deleteMessage(command.getMessage());
                    pollmanager.setLastMessage(serverid, name, message);
                });

            }).catch(err=>{ //MESSAGE WAS DELETED BY OTHER PARTY
                module.exports.sendMessage(command, module.exports.pollToString(poll)).then(message=>{
                    module.exports.deleteMessage(command.getMessage());
                    pollmanager.setLastMessage(serverid, name, message);
                });
            });
        }else{
            module.exports.sendMessage(command, module.exports.pollToString(poll)).then(message=>{
                module.exports.deleteMessage(command.getMessage());
                pollmanager.setLastMessage(serverid, name, message);
            });
        }
        return;
    }
}