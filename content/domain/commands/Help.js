var genericfunctions = require('../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var params = command.getParameters();
        if(params.length==0){
            //GIVE HELP ABOUT ALL COMMANDS
            var author = command.getMessage().author;
            var content = "----------------------------------------------------------\n";
            content += "Help has arrived. Here is a list of all possible commands:\n";
            var commandlist = require("../../storage/commands.js");
            for(var i=0;i<commandlist.length;i++){
                if(commandlist[i].disabled) continue;
                content += "\n"+command.getPrefix()+commandlist[i].command+": "+commandlist[i].description;
            }
            content += "\n\nFor more information about a command, type '"+command.getPrefix()+"help -c command'.";
            command.getMessage().author.send(content);
            genericfunctions.deleteMessage(command.getMessage());
            return;
        }else{
            //GIVE HELP ABOUT THE COMMAND IN PARAM WITH KEY c
            var author = command.getMessage().author;
            var com = params[0].value.trim();
            if(com.substring(0,1)===".")com=com.substring(1);
            var content = "----------------------------------------------------------\n";
            content += "Help has arrived for the command " + command.getPrefix() + com + ":";
            var commandlist = require("../../storage/commands.js");
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

            command.getMessage().author.send(content);
            genericfunctions.deleteMessage(command.getMessage());
            return;
        }
    }
};