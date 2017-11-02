var genericfunctions = require('../../GenericFunctions.js');
var commandlist = require('../../../storage/commands.js');

module.exports = {
    execute: function(command){
        
        var serverid = null;
        var userid = command.getMessage().author.id;
        if(command.getMessage().guild !== undefined && command.getMessage().guild !== null && command.getMessage().guild.id !== null){
            serverid = command.getMessage().guild.id;
        }
        
        var content = "----------------------------------------------------------\n";
        content += "Here is a list of all commands for admins:\n";
        var commandlist = JSON.parse(JSON.stringify(require("../../../storage/commands.js")));
        var categories = [];
        for(var i=0;i<commandlist.length;i++){
            if(commandlist[i].category !== undefined && commandlist[i].category !== null && categories.indexOf(commandlist[i].category)===-1) categories.push(commandlist[i].category);
        }

        var ordered_commandlist = [];
        for(var i=0;i<categories.length;i++){
            for(var j=0;j<commandlist.length;j++){
                if(commandlist[j].category === categories[i]) ordered_commandlist.push(commandlist[j]);
            }
        }

        var prev_category = null;
        for(var i=0;i<ordered_commandlist.length;i++){
            if(ordered_commandlist[i].disabled) continue;
            if(ordered_commandlist[i].required_role !== "admin") continue;
            if(prev_category===null) content += "\n";
            if(prev_category===null){
                content += "```\n" + ordered_commandlist[i].category.charAt(0).toUpperCase() + ordered_commandlist[i].category.slice(1) + ":";
                prev_category = ordered_commandlist[i].category;
            }else if(prev_category !== ordered_commandlist[i].category){
                content += "```\n";
                content += "```\n" + ordered_commandlist[i].category.charAt(0).toUpperCase() + ordered_commandlist[i].category.slice(1) + ":";
                prev_category = ordered_commandlist[i].category;
            }
            content += "\n"+command.getPrefix()+ordered_commandlist[i].command+": "+ordered_commandlist[i].description;
        }
        content += "\n```";

        content += "\nFor more information about a command, type '"+command.getPrefix()+"help -c command'.";
        genericfunctions.sendPM(command, command.getMessage().author.id, content, true);
        return;
    }
};