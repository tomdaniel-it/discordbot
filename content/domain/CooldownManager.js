var commandlist = require('../storage/commands.js');

var command_usage = {};
/* 
 * {
 *  serverid(String): [
 *      {
 *          author_id: String,
 *          command: String,
 *          executed_at: Date (num generated by Date.now())
 *      }
 *  ]
 * }
 * DOES NOT CONTAIN DOUBLES WITH AUTHOR_ID + COMMAND, ONLY LATEST IS KEPT
*/ 

function addServer(serverid){
    serverid = serverid.toString();
    if(command_usage[serverid] !== undefined && command_usage[serverid] !== null) return;
    command_usage[serverid] = [];
    return;
}

function getServer(serverid){
    serverid = serverid.toString();
    if(command_usage[serverid] === undefined) return null;
    return command_usage[serverid];
}

function addCommand(serverid, author_id, command, executed_at){
    serverid = serverid.toString();
    if(getServer(serverid) === null) addServer(serverid);
    removeCommand(serverid, author_id, command);
    command_usage[serverid].push({author_id:author_id, command:command, executed_at:executed_at});
    return;
}

function removeCommand(serverid, author_id, command){
    serverid = serverid.toString();
    var server = getServer(serverid);
    if(server === null) return;
    for(var i=0;i<server.length;i++){
        if(server[i].author_id === author_id && server[i].command === command){
            server.splice(i, 1);
            return;
        }
    }
    return;
}

function getCooldownTimeOfCommand(command){ //RETURNS COOLDOWNTIME OF COMMAND IN MILISECONDS
    if(command === null) return 0;
    for(var i=0;i<commandlist.length;i++){
        if(commandlist[i].command === command){
            return ((commandlist[i].cooldown_time === undefined || commandlist.cooldown_time === null)?0:(commandlist[i].cooldown_time*1000));
        }
    }
    return 0;
}

module.exports = {
    isOnCooldown: function(serverid, author_id, command){
        serverid = serverid.toString();
        var server = getServer(serverid);
        if(server === null) return false;
        for(var i=0;i<server.length;i++){
            if(server[i].author_id === author_id && server[i].command === command){
                var diff = Date.now() - server[i].executed_at;
                return diff < getCooldownTimeOfCommand(command);
            }
        }
        return false;
    },
    addCommand: function(serverid, author_id, command){
        serverid = serverid.toString();
        addCommand(serverid, author_id, command, Date.now());
    },
    getCooldownTimeOfCommand: function(command){
        return getCooldownTimeOfCommand(command) / 1000;
    }
}