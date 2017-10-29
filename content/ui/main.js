const Command = require("../domain/Command.js");
const CommandHandler = require("../domain/CommandHandler.js");
const commandlist = require("../storage/commands.js");

const Discord = require('discord.js');
const bot = new Discord.Client();
var prefix = require('../../settings.js').command_prefix;
var genericfunctions = require("../domain/GenericFunctions.js");
var result;

var events = require('events'),
util = require('util');

process
.once('SIGINT', () => process.exit(1))
.once('SIGTERM', () => process.exit(1));

bot.on('ready', ()=>{ //BOT LAUNCHED
    console.log('Bot launched...');
    bot.user.setStatus('Online'); //Status: 'Online', 'idle', 'invisible', 'dnd'
    bot.user.setGame("'.help' for info") //Will display 'Playing xxx' under bot name
});

bot.on('message', message=>{ //MESSAGE SENT
    if(message.author.id === '368465430924230670') return;
    if(message.system) return;
    if(message.content.indexOf(prefix)!==0) return;

    var command = new Command(message, prefix);
    result = command.createParameters();
    if(result!==true){
        genericfunctions.sendErrorMessage(command, result);
        return;
    }

    result = isValidInput(command.getCommand(), command.getParameters());
    if(result!==true){
        genericfunctions.sendErrorMessage(command, result);
        return;
    }

    //HANDLE COMMAND
    commandhandler = new CommandHandler(command);
    commandhandler.run();
    
});

bot.on('guildMemberAdd', member=>{ //USER JOINS SERVER

})

bot.login('MzY4NDY1NDMwOTI0MjMwNjcw.DMKX1g.k8vIj-8ZNrSOktBIx4e9ks8UFAQ');

function isValidInput(command, parameters){

    //CHECK FOR COMMAND NAME
    var command_id = -1;
    for(var i=0;i<commandlist.length;i++){
        if(commandlist[i].command===command){
            command_id = i;
            break;
        }
    }
    if(command_id===-1) return "I don't know that command :c";
    var commandItem = commandlist[i];
    if(commandItem.disabled) return "The command " + prefix + command + " is disabled.";

    //CHECK FOR REQUIRED PARAMETERS
    var param_missing = false;
    var missing_params = [];
    for(var i=0;i<commandItem.required_params.length;i++){
        var param_key = commandItem.required_params[i].key;
        var param_found = false;
        missing_params.push(param_key);
        for(var j=0;j<parameters.length;j++){
            if(param_key===parameters[j].key){
                param_found = true;
                missing_params.splice(missing_params.indexOf(param_key));
            }
        }
        if(!param_found){
            param_missing = true;
        }
    }
    if(param_missing){
        var cont = "Missing required parameters for '" + prefix + command + "'. Use '" + prefix + "help -c command' for more information.";
        cont += "\nMissing: ";
        for(var i=0;i<missing_params.length;i++){
            cont += "-" + missing_params[i] + "  ";
        }
        return cont;
    }

    //CHECK FOR UNKNOWN PARAMETERS
    var unknown_param_found = false;
    for(var i=0;i<parameters.length;i++){
        var found = false;
        for(var j=0;j<commandItem.required_params.length;j++){
            if(parameters[i].key===commandItem.required_params[j].key){
                found = true;
                break;
            }
        }
        if(unknown_param_found) break;
        for(var j=0;j<commandItem.optional_params.length;j++){
            if(parameters[i].key===commandItem.optional_params[j].key){
                found = true;
                break;
            }
        }
        if(!found) {
            unknown_param_found = true;
            break;
        }
    }
    if(unknown_param_found) return "Unknown parameter used for '" + prefix + command + "'. Use '" + prefix + "help -c command' for more information.";

    return true;
}
