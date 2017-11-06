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

        var name = command.getParameters();
        if(pollmanager.get(serverid, name)===null){
            genericfunctions.sendErrorMessage(command, "There is no poll with that name.");
            return;
        }
        genericfunctions.pollSendMessage(serverid, name, command);
    }
};