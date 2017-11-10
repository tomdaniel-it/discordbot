var soundboardmanager = require('../../SoundboardManager.js');
var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var sound = command.getParameters();
        soundboardmanager.getAll().on('ready', result=>{
            for(var i=0;i<result.length;i++){
                if(result[i].toLowerCase() === sound.toLowerCase()){
                    sound = result[i];
                    break;
                }
            }
            soundboardmanager.play(sound).on('ready', (result, error)=>{
                if(error){
                    genericfunctions.sendErrorMessage(command, error.message);
                    return;
                }
                genericfunctions.deleteMessage(command.getMessage());
            });
        });
    }
};