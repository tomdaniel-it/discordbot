var soundboardmanager = require('../../SoundboardManager.js');
var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var params = command.getParameters();
        params = (params === "" ? null : params);
        if(params !== null && params.length !== 0 && params.slice(-1) !== "/"){
            params += "/";
        }
        soundboardmanager.getAll().on('ready', result=>{
            if(params !== null){
                for(var i=0;i<result.length;i++){
                    if(result[i].indexOf("/") === -1) continue;
                    if(result[i].split("/")[0].toLowerCase()+"/" === params.toLowerCase()){
                        params = result[i].split("/")[0]+"/";
                    }
                }
            }
            soundboardmanager.get(params).on('ready', (result, error)=>{
                if(error){
                    genericfunctions.sendErrorMessage(command, error.message);
                    return;
                }
                var content = "Here is a list of the sounds requested:\n```";
                for(var i=0;i<result.length;i++){
                    content += "\n"+result[i];
                }
                content += "\n```\nHint: you can use '" + require('../../../../settings.js').command_prefix + "sb_list [directory]' for more information.";
                genericfunctions.sendPM(command, command.getMessage().author.id, content, true);
            });
        });
    }
};