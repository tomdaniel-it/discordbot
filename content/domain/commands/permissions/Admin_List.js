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

        var admins = rolemanager.getAdmins(serverid); //[userid: String]
        var admin_names = [];
        var members = guild.members.array();
        for(var i=0;i<members.length;i++){
            if(admins.indexOf(members[i].user.id.toString()) !== -1){
                admin_names.push(members[i].user.username + " (id: " + members[i].user.id + ")");
                admins.splice(admins.indexOf(members[i].user.id),1);
            }
        }
        for(var i=0;i<admins.length;i++){
            admin_names.push("Unknown name (id: " + admins[i] + ")");
        }

        var content = "Here is a list of all admins:\n```";
        for(var i=0;i<admin_names.length;i++){
            content += "\n" + admin_names[i];
        }
        content += "\n```";

        genericfunctions.sendPM(command, command.getMessage().author.id, content, true);
        return;
        
    }
};