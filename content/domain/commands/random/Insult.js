var genericfunctions = require('../../GenericFunctions.js');
var settings = require('../../../../settings.js');

module.exports = {
    execute: function(command){
        var fs = require('fs');
        var insults  = fs.readFileSync("content/storage/insults.txt").toString().split("\n");
        var insult = insults[Math.floor(Math.random()*insults.length)];
        var params = command.getParameters();
        if(params.length===0){
            //SEND INSULT
            genericfunctions.sendMessage(command, insult);
        }else{
            //SEND INSULT WITH PERSON (KEY p)
            if(params.toLowerCase().indexOf("iswbot") !== -1 || params.toLowerCase().indexOf(settings.bot_id) !== -1){
                var comeback = "What the fuck did you just fucking say about me <@" + command.getMessage().author.id + ">, you НO0ОଠOOOOOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ? I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, 💯 thats what im talking about right there right there . You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of go౦ԁ sHit👌 across the USA and your IP is being traced right there👌👌 right✔there ✔, so ✔if i do ƽaү so my self 💯 i say so 💯, you better prepare for the storm, НO0ОଠOOOOOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ👌. The storm that wipes out the pathetic little thing you call your life. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fucking 👌shit. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. 💯 👌 👀 ";
                genericfunctions.sendMessage(command, comeback);
                return;
            }
            genericfunctions.sendMessage(command, params + ", " + insult);
        }
        return;
    }
};