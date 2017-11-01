var pollmanager = require('../../PollManager.js');
var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var guild = command.getMessage().guild;
        var serverid = null;
        var userid = command.getMessage().author.id;
        var username = command.getMessage().author.username;

        if(guild === undefined || guild === null){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }
        var serverid = guild.id;
        if(guild.id === undefined || guild.id === null || guild.id.length === 0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        var name = null;
        var options = null;
        var params = command.getParameters();

        for(var i=0;i<params.length;i++){
            if(params[i].key === "name"){
                name = params[i].value;
            }else{
                options = params[i].value;
            }
        }
        
        options = (options === null ? null : options.split(";"));

        try{
            pollmanager.create(serverid, name, username, options);
        }catch(err){
            genericfunctions.sendErrorMessage(command, err.message);
            return;
        }

        genericfunctions.pollSendMessage(serverid, name, command);
    }
};