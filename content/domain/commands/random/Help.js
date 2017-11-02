var genericfunctions = require('../../GenericFunctions.js');
var rolemanager = require('../../RoleManager.js');

module.exports = {
    execute: function(command){
        var serverid = null;
        var userid = command.getMessage().author.id;
        if(command.getMessage().guild !== undefined && command.getMessage().guild !== null && command.getMessage().guild.id !== null){
            serverid = command.getMessage().guild.id;
        }
        var params = command.getParameters();
        if(params.length==0){
            //GIVE HELP ABOUT ALL COMMANDS
            var author = command.getMessage().author;
            var content = "----------------------------------------------------------\n";
            content += "Help has arrived. Here is a list of all possible commands:\n";
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
                if(serverid !== null && ordered_commandlist[i].required_role === "admin" && !rolemanager.isAdmin(serverid, userid)) continue;
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
        }else{
            //GIVE HELP ABOUT THE COMMAND IN PARAM WITH KEY c
            var author = command.getMessage().author;
            var com = params[0].value.trim();
            if(com.substring(0,1)===".")com=com.substring(1);
            var content = "----------------------------------------------------------\n";
            content += "Help has arrived for the command " + command.getPrefix() + com + ":";
            var commandlist = require("../../../storage/commands.js");
            for(var i=0;i<commandlist.length;i++){
                if(commandlist[i].command===com){
                    commandlist = commandlist[i];
                }
            }
            if(commandlist.description===undefined){
                genericfunctions.sendErrorMessage(command, "I can't offer help for a command I don't know.");
                return;
            }
            if(commandlist.disabled){
                genericfunctions.sendErrorMessage(command, "I'm not allowed to give help for " + command.getPrefix() + com + " because it is disabled.");
                return;
            }
            content += "\n\nDescription: "+commandlist.description;
            content += "\n\nRequired parameters:";
            if(commandlist.required_params.length===0){
                content += " none";
            }else{
                for(var i=0;i<commandlist.required_params.length;i++){
                    content += "\n    -"+commandlist.required_params[i].key+": ";
                    content += commandlist.required_params[i].description;
                }
            }
            
            content += "\n\nOptional parameters:";
            if(commandlist.optional_params.length===0){
                content += " none";
            }else{
                for(var i=0;i<commandlist.optional_params.length;i++){
                    content += "\n    -"+commandlist.optional_params[i].key+": ";
                    content += commandlist.optional_params[i].description;
                }
            }

            genericfunctions.sendPM(command, command.getMessage().author.id, content, true);
            return;
        }
    }
};