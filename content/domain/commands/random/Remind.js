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

        var regex = /^<@(\d+)>$/;
        var userid = null;
        if(regex.test(user)){
            //USER IS WITH @MENTION
            var match = regex.exec(user);
            userid = match[1];
        }else{
            //USER IS NORMAL TEXT
            var members = guild.members.array();
            for(var i=0;i<members.length;i++){
                if(members[i].user.username.trim().toLowerCase() === user.trim().toLowerCase()){
                    userid = members[i].user.id;
                    break;
                }
            }
            if(userid === null){
                genericfunctions.sendErrorMessage(command, "No user was found with this username.");
                return;
            }
        }
        
        var content = "---------------------------------";
        content += "\nReminder" + (anonymous?(""):(" by " + author)) + ": " + message;
        var members = guild.members.array();
        for(var i=0;i<members.length;i++){
            if(members[i].user.id.toString() === userid.toString()){
                members[i].user.send(content);
                genericfunctions.deleteMessage(command.getMessage());
                return;
            }
        }
        genericfunctions.sendErrorMessage(command, "No user was found with this username.");
        return;
    }
};