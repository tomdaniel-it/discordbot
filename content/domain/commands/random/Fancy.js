var genericfunctions = require('../../GenericFunctions.js');

module.exports = {
    execute: function(command){
        var fancylist = require("../../../storage/fancylist.js");
        var fonts = fancylist.fonts;
        var decorations = fancylist.decorations;
        
        var params = command.getParameters();
        var message = "";
        var fontWanted = false;
        var decorationWanted = false;

        params = params.split(" ");
        var style = "";
        var last = params.length - 1;
        if(params[0].toLowerCase() === "f" || params[0].toLowerCase() === "d" || params[0].toLowerCase() === "df" || params[0].toLowerCase() === "fd"){
            style = params[0].toLowerCase();
            params.shift();
        }else if(params[last].toLowerCase() === "f" || params[last].toLowerCase() === "d" || params[last].toLowerCase() === "df" || params[last].toLowerCase() === "fd"){
            style = params[last].toLowerCase();
            params.pop();
        }
        if(style.indexOf("f") !== -1){
            fontWanted = true;
        }
        if(style.indexOf("d") !== -1){
            decorationWanted = true;
        }

        for(var i=0;i<params.length;i++){
            if(i !== 0) message += " ";
            message += params[i];
        }
        
        if(fontWanted){
            //CHANGE ALL ALPHABETICAL LETTERS TO LETTERS FROM RANDOMLY CHOSEN FONT 
            var random = Math.floor(Math.random()*fonts.length);
            var font = fonts[random];
            for(var i=0;i<message.length;i++){
                var asciicode = message.charCodeAt(i);
                if((asciicode >= 65 && asciicode <= 90) || (asciicode >= 97 && asciicode <= 122)){
                    //CHAR IS ALPHABETICAL => REPLACE WITH FONT CHAR
                    var positionvar = (asciicode <= 90 ? 39 : 97 );
                    message = message.substring(0, i) + font[asciicode-positionvar] + message.substring(i+1);
                }
            }
        }

        if(decorationWanted){
            //ADD RANDOMLY CHOSEN DECORATION TO BEGINNING & ENDING OF MESSAGE
            var decoration = decorations[Math.floor(Math.random()*decorations.length)];
            message = decoration[0] + "   " +  message.trim() + "   " + decoration[1];
        }

        //if(command.getMessage().channel.type!=="dm")command.getMessage().delete();
        genericfunctions.sendMessage(command, message + "  -" + command.getMessage().author.username);
        genericfunctions.deleteMessage(command.getMessage());
        return;

    }
};