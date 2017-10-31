var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var serverid = command.getMessage().guild.id.toString();
        var num = Number(command.getParameters()[0].value);

        if(serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        var item = require('../music/Music_Add.js').getPickerListItem(serverid);
        if(item === null){
            genericfunctions.sendErrorMessage(command, "First do '" + require('../../../../settings.js').command_prefix + "music_add -search Title' to get options to pick one out of.");
            return;
        }

        if(isNaN(num)){
            genericfunctions.sendErrorMessage(command, "-num must be a number from the options above");
            return;
        }

        item.emitter.emit('picked', command, item.songs[num-1], item.original_message);

    }
};