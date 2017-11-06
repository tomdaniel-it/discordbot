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

        var params = command.getParameters();
        var name = params.split(" ")[0];
        var option = params.substring(name.length+1);
        option = Number(option);
        if(isNaN(option)){
            genericfunctions.sendErrorMessage(command, "option must be the number of the option to unvote to");
            return;
        }
        option--;

        try{
            pollmanager.unvote(serverid, name, option, userid);
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
            return;
        }
        
        genericfunctions.pollSendMessage(serverid, name, command);
        return;
    }
};