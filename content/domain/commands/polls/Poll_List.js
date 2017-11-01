var pollmanager = require('../../PollManager.js');
var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var guild = command.getMessage().guild;
        var serverid = null;
        var userid = command.getMessage().author.id;

        if(guild === undefined || guild === null){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }
        var serverid = guild.id;
        if(guild.id === undefined || guild.id === null || guild.id.length === 0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        var polls = pollmanager.getList(serverid);
        var content = "";
        if(polls === undefined || polls === null || polls.length === 0){
            genericfunctions.sendErrorMessage(command, "There are currently no polls.");
            return;
        }else{
            content += "Polls:\n```";
            for(var i=0;i<polls.length;i++){
                content += "\n- " + polls[i].name + " (Author: " + polls[i].author + ")";
            }
            content += "\n```";
        }
        
        genericfunctions.sendMessage(command, content);
        return;
    }
};