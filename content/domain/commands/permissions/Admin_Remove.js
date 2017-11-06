var genericfunctions = require('../../GenericFunctions.js');
var rolemanager = require('../../RoleManager.js');

module.exports = {
    execute: function(command){
        var guild = command.getMessage().guild;
        if(guild === undefined || guild === null){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }
        var serverid = guild.id;
        if(serverid === undefined || serverid === null || serverid.length === 0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        var param = command.getParameters();
        var regex = /^<@!?(\d+)>$/;
        var userids = [];

        if(regex.test(param)){ //PARAM IS A @USER MENTION
            var match = regex.exec(param);
            userids.push(match[1]);
        }else{ //PARAM IS A NORMAL TEXT USERNAME
            var members = guild.members.array();
            for(var i=0;i<members.length;i++){
                if(members[i].user.username.trim().toLowerCase() === param.trim().toLowerCase() !== -1){
                    userids.push(members[i].user.id);
                }
            }
            if(userids.length === 0){
                genericfunctions.sendPM(command, command.getMessage().author.id, "No user was found by that name, try using an @Mention.", true);
                return;
            }
        }
        
        for(var i=0;i<userids.length;i++){
            rolemanager.unsetAdmin(serverid, userids[i]);
        }
        
        genericfunctions.sendPM(command, command.getMessage().author.id, "The admin role has been removed from that user", true);
        return;
    }
};