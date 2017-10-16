module.exports = {
    execute: function(command){
        var fancylist = require("../storage/fancylist.js");
        var fonts = fancylist.fonts;
        var decorations = fancylist.decorations;
        
        var params = command.getParameters();
        var message = "";
        var fontWanted = false;
        var decorationWanted = false;


        for(var i=0;i<2;i++){
            if(params[i].key=="style"){
                if(params[i].value.indexOf('f')!==-1) fontWanted = true;
                if(params[i].value.indexOf('d')!==-1) decorationWanted = true;
            }else if(params[i].key=="message"){
                message = params[i].value;
            }else{
                require('../domain/GenericFunctions.js').sendErrorMessage(command, "Something went wrong :/");
                return;
            }
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
        command.getMessage().channel.send(message + "  -" + command.getMessage().author.username);
        require('../domain/GenericFunctions.js').deleteMessage(command.getMessage());
        return;

    }
};