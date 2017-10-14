module.exports = {
    execute: function(command){
        var params = command.getParameters();
        if(params.length==0){
            //GIVE HELP ABOUT ALL COMMANDS
        }else{
            //GIVE HELP ABOUT THE COMMAND IN PARAM WITH KEY c
            var author = command.getMessage().author;
            var com = params[0].value.trim();
            var content = "Help has arrived for the command " + command.getPrefix() + com + ":";
            var commandlist = require("../storage/commands.js");
            for(var i=0;i<commandlist.length;i++){
                if(commandlist[i].command===com){
                    commandlist = commandlist[i];
                }
            }
            if(commandlist.description===undefined){
                command.getMessage().channel.send("I can't offer help for a command I don't know.");
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
        }
    }
};