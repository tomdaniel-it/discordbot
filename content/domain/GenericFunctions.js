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
    sendPM: function(command, userid, content, deleteOriginal){
        var guild = command.getMessage().guild;
        if(guild === undefined || guild === null){
            module.exports.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }
        var members = guild.members.array();
        var user = null;
        for(var i=0;i<members.length;i++){
            if(members[i].user.id.toString() === userid.toString()){
                user = members[i].user;
                break;
            }
        }
        if(user === null){
            module.exports.sendErrorMessage(command, "No user was found with this username.");
            return;
        }
        user.send(content);
        if(deleteOriginal){
            module.exports.deleteMessage(command.getMessage());
        }
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
    },
    getUserId: function(command, guild, user_mention_or_name){
        if(guild === undefined || guild === null || guild.members === undefined ||guild.members === null){
            module.exports.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }
        var regex = /^<@!?(\d+)>$/;
        var userid = null;
        if(regex.test(user_mention_or_name)){
            //USER IS WITH @MENTION
            var match = regex.exec(user_mention_or_name);
            userid = match[1];
        }else{
            //USER IS NORMAL TEXT
            var members = guild.members.array();
            for(var i=0;i<members.length;i++){
                var withoutApo = (user_mention_or_name.substring(0,1) === "@"?user_mention_or_name.substring(1):user_mention_or_name);
                if(members[i].user.username.trim().toLowerCase() === user_mention_or_name.trim().toLowerCase() || members[i].user.username.trim().toLowerCase() === withoutApo.trim().toLowerCase()){
                    userid = members[i].user.id;
                    break;
                }
                if(members[i].nickname !== null && (members[i].nickname.trim().toLowerCase() === user_mention_or_name.trim().toLowerCase() || members[i].nickname.trim().toLowerCase() === withoutApo.trim().toLowerCase() )){
                    userid = members[i].user.id;
                    break;
                }
            }
            if(userid === null){
                module.exports.sendErrorMessage(command, "No user was found with this username.");
                return;
            }
        }
        return userid;
    }
}