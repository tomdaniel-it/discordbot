var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var author_id = command.getMessage().author.id;
        var author = command.getMessage().author.username;
        var params = command.getParameters();
        
        var guild = command.getMessage().guild;
        if(guild === undefined || guild === null){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }
        var serverid = guild.id;
        if(guild.id === undefined || guild.id === null || guild.id.length === 0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        var result = genericfunctions.seperateUserFromText(command, guild, params);
        if(result[0] === null){
            genericfunctions.sendErrorMessage(command, "Make sure to include the name of the user to remind.");
            return;
        }
        var userid = result[0];
        var message = result[1];

        if(userid === undefined || userid === null) return;
        var content = "---------------------------------";
        content += "\nReminder" + " by " + author + ": " + message;
        genericfunctions.sendPM(command, userid, content, true);
        return;
    }
};