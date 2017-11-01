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
        var name = (params[0].key==="name"?params[0].value:params[1].value);
        var option = (params[0].key==="option"?params[0].value:params[1].value);
        option = Number(option);
        if(isNaN(option)){
            genericfunctions.sendErrorMessage(command, "option must be the number of the option to delete");
            return;
        }
        option--;

        try{
            pollmanager.removeOption(serverid, name, option);
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
            return;
        }
        genericfunctions.pollSendMessage(serverid, name, command);
        return;
    }
};