const Command = require("../domain/Command.js");
const CommandHandler = require("../domain/CommandHandler.js");
const commandlist = require("../storage/commands.js");
const categorylist = require("../storage/categories.js");

const Discord = require('discord.js');
const bot = new Discord.Client();
var prefix = require('../../settings.js').command_prefix;
var genericfunctions = require("../domain/GenericFunctions.js");
var rolemanager = require('../domain/RoleManager.js');
var cooldownmanager = require('../domain/CooldownManager.js');
var iswservicemanager = require('../domain/IswServiceManager.js');
var settings = require('../../settings.js');
var result;

var events = require('events'),
util = require('util');

bot.on('ready', ()=>{ //BOT LAUNCHED
    console.log('Bot launched...');
    bot.user.setStatus('Online'); //Status: 'Online', 'idle', 'invisible', 'dnd'
    bot.user.setGame("'.help' for info") //Will display 'Playing xxx' under bot name
    try{
        if(settings.isw_service_warning_enabled){
            var isw_guild = null;
            var isw_guild_id = settings.isw_discord_server_id;
            var guilds = bot.guilds.array();
            for(var i=0;i<guilds.length;i++){
                if(guilds[i].id.toString() === isw_guild_id){
                    isw_guild = guilds[i];
                }
            }
            if(isw_guild === null){
                console.log("Warning: Can't enable isw_service_warner because bot can't find the guild of ISW.");
            }else{
                iswservicemanager.run(isw_guild);
            }
        }
    }catch(err){
        genericfunctions.logDirectError(err.message);
    }
});

process.on('unhandledRejection', (reason, p) => {
    try{
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
        genericfunctions.logDirectError('Unhandled Rejection at: Promise' + JSON.stringify(p), 'reason:', JSON.stringify(reason));
    }catch(err){
        genericfunctions.logDirectError(err.message);
    }
  });

bot.on('message', message=>{ //MESSAGE SENT
    try{
        if(message.author.id === '368465430924230670') return;
        if(message.system) return;
        if(message.content.indexOf(prefix)!==0) return;

        var command = new Command(message, prefix);
        result = command.createParameters();
        genericfunctions.logMessage(command);

        try{
            //CHECK IF USAGE OF COMMAND & PARAMETERS IS CORRECT
            if(result!==true){
                genericfunctions.sendErrorMessage(command, result);
                return;
            }
            
            //CHECK IF COMMAND USAGE IS CORRECT
            result = isValidInput(command.getCommand(), command.getParameters());
            if(result!==true){
                genericfunctions.sendErrorMessage(command, result);
                return;
            }

            result = validateIswOnly(command.getCommand(), command.getMessage().guild);
            if(result!==true){
                genericfunctions.sendErrorMessage(command, result);
                return;
            }
    
            if(command.getMessage().guild !== null){
                //CHECK IF USER HAS NEEDED PERMISSIONS
                result = hasPermissionsForCommand(command.getMessage().guild.id, command.getCommand(), command.getMessage().author.id);
                if(!result){
                    genericfunctions.sendErrorMessage(command, "You do not have permissions to use this command.");
                    return;
                }
    
                //CHECK COOLDOWN
                result = isOnCooldown(command.getMessage().guild.id, command.getCommand(), command.getMessage().author.id);
                if(result){
                    var cooldown = cooldownmanager.getCooldownTimeOfCommand(command.getCommand()); //IN SECONDS
                    var newcooldown = cooldown;
                    var cooldown_unit = "second";
                    if(cooldown > 60){
                        cooldown_unit = "minute";
                        newcooldown = Math.floor(cooldown / 60); //IN MINS
                        newcooldown += ( (100/60 * (cooldown % 60) ) /100 );
                    }
                    if(newcooldown > 60){
                        cooldown_unit = "hour";
                        newcooldown = Math.floor(cooldown / 3600); //IN HOURS
                        newcooldown += ( (100/3600 * (cooldown % 3600) ) /100 );
                    }
                    genericfunctions.sendErrorMessage(command, "This command has a " + newcooldown + " " + cooldown_unit + " cooldown time.");
                    return;
                }else{
                    cooldownmanager.addCommand(command.getMessage().guild.id, command.getMessage().author.id, command.getCommand());
                }
            }
    
            //HANDLE COMMAND
            commandhandler = new CommandHandler(command);
            commandhandler.run();
        }catch(err){
            genericfunctions.logError(command, err.message);
        }
    }catch(err){
        genericfunctions.logDirectError(err.message);
    }


});

bot.on("guildCreate", (guild) => {
    //SEND WELCOME MESSAGE IN MAIN CHANNEL
    try{
        var channels = guild.channels.array();
        var message_channel = null;
        for(var i=0;i<channels.length;i++){
            if(channels[i].name.toLowerCase() === "general" && channels[i].type === "text"){
                message_channel = channels[i];
            }
            if(channels[i].name.toLowerCase().indexOf("bot") !== -1 && channels[i].type === "text"){
                message_channel = channels[i];
                break;
            }
        }
        if(message_channel===null) return;
        var content = "Hello, I'm ISWBot. To get started, type '" + settings.command_prefix + "help' or '" + settings.command_prefix + "help category' (";
        for(var i=0;i<categorylist.length;i++){
            if(i !== 0) content += ",";
            content += categorylist[i].category;
        }
        content += "). :)";
        message_channel.send(content);
        
    
        //MAKE API_CREATOR & SERVER_OWNER ADMIN
        var api_creator_id = require('../../keys.js').api_creator_id;
        var server_owner_id = guild.ownerID;
        rolemanager.setAdmin(guild.id, api_creator_id);
        rolemanager.setAdmin(guild.id, server_owner_id);
    }catch(err){
        genericfunctions.logDirectError(err.message);
    }

});

bot.login(require("../../keys.js").discord_bot_token);

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
    if(commandItem.required_params.length > 0 && (commandItem.required_params.length > parameters.split(' ').length || parameters === "")){
        var cont = "Missing required parameters for '" + prefix + command + "'. Use '" + prefix + "help " + command + "' for more information.";
        return cont;
    }
    return true;
}

function hasPermissionsForCommand(serverid, command, userid){
    serverid = serverid.toString();
    var required_role = null;
    for(var i=0;i<commandlist.length;i++){
        if(commandlist[i].command === command.toLowerCase()){
            required_role = commandlist[i].required_role;
            break;
        }
    }
    if(required_role === null) return true;
    return rolemanager.isAdmin(serverid, userid);
}

function isOnCooldown(serverid, command, author_id){
    serverid = serverid.toString();
    return cooldownmanager.isOnCooldown(serverid, author_id, command);
}

function validateIswOnly(command, guild){
    var commandObj = null;
    for(var i=0;i<commandlist.length;i++){
        if(commandlist[i].command === command.toLowerCase()){
            commandObj = commandlist[i];
        }
    }
    if(commandObj === null || !commandObj.isw_only){
        return true;
    }
    if(guild === undefined || guild === null || guild.id === undefined || guild.id === null){
        return "This command can only be used in the discord server of ISW.";
    }
    if(guild.id.toString() !== settings.isw_discord_server_id){
        return "This command can only be used in the discord server of ISW.";
    }
    return true;
}