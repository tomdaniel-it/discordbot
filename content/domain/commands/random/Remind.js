var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var author_id = command.getMessage().author.id;
        var author = command.getMessage().author.username;
        var params = command.getParameters();
        var user = null;
        var message = null;
        var anonymous = false;
        
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

        for(var i=0;i<params.length;i++){
            switch(params[i].key.toLowerCase()){
                case "user":
                    user = params[i].value;
                    break;
                case "message":
                    message = params[i].value;
                    break;
                case "anonymous":
                    anonymous = params[i].value.toLowerCase().trim();
                    if(anonymous !== "true" && anonymous !== "false"){
                        genericfunctions.sendErrorMessage(command, "-anonymous must be set to true or false.");
                        return;
                    }
                    anonymous = anonymous === "true";
                    break;
                default:
                    continue;
            }
        }

        var userid = genericfunctions.getUserId(command, guild, user);
        if(userid === undefined || userid === null) return;
        var content = "---------------------------------";
        content += "\nReminder" + (anonymous?(""):(" by " + author)) + ": " + message;
        genericfunctions.sendPM(command, userid, content, true);
        return;
    }
};