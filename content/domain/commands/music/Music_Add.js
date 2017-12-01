var genericfunctions = require('../../GenericFunctions');
var playlist = require('../../Playlist.js');
var yt_api = require('../../YT_api.js');
var emitter = require('events').EventEmitter;
var pickerList = []; //[{serverid: String, emitter: EventEmitter, songs: [{url:String, type:String, title:String, duration:String}], original_message: Message }]

function getPickerListItem(serverid){
    var item = null;
    for(var i=0;i<pickerList.length;i++){
        if(pickerList[i].serverid === serverid){
            item = pickerList[i];
            break;
        }
    }
    return item;
}

function addPickerListItem(serverid, emitter, songs, original_message){
    if(getPickerListItem(serverid)!==null) removePickerListItem(serverid);
    pickerList.push({serverid: serverid, emitter: emitter, songs:songs, original_message:original_message});
}

function removePickerListItem(serverid){
    var id = -1;
    for(var i=0;i<pickerList.length;i++){
        if(pickerList[i].serverid === serverid){
            id = i;
            break;
        }
    }
    if(id===-1) return;
    pickerList.splice(id, 1);
    return;
}

module.exports = {
    getPickerListItem: getPickerListItem, 
    execute: function(command){
        var position = null;

        var serverid = command.getMessage().guild.id.toString();
        var params = command.getParameters();
        params = params.replace(/ +(?= )/g,'');

        if(serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        var lastword = params.split(" ")[params.split(" ").length-1];
        if(!isNaN(lastword)){
            position = Number(lastword);
            params = params.substring(0, params.length - lastword.length);
        }

        var regex = /youtube\.com\/watch\?v=([a-zA-Z0-9\-\_]+)/;
        if(regex.test(params) && params.split(" ").length > 1){
            genericfunctions.sendErrorMessage(command, "You must include a youtube url OR title in the command '" + require('../../../../settings.js').command_prefix + "music_add'.");
            return;
        }

        //METHOD = URL
        if(regex.test(params)){
            yt_api.getInfo(params).on('ready', (song, err)=>{
                if(err){
                    //URL INCORRECT
                    genericfunctions.sendErrorMessage(command, "Provided url was incorrect, please use YouTube urls of songs.");
                    return;
                }else if(song.liveBroadcastContent !== "none"){
                    //SONG IS LIVESTREAM, GIVES ERROR WHEN TRYING TO PLAY WHICH CANNOT BE CATCHED (YTDL)
                    genericfunctions.sendErrorMessage(command, "I can't play livestreams, try playing another song.");
                    return;
                }
                try{
                    playlist.add(serverid, song, position);
                    genericfunctions.sendErrorMessage(command, "Added song to playlist.");
                    return;
                }catch(err){
                    genericfunctions.sendErrorMessage(command, err.message);
                    return;
                }
                
            });
        }

        //METHOD = SEARCH
        if(!regex.test(params)){
            yt_api.getSearchResults(params).on('ready', result=>{
                if(result === null || result.length === 0){
                    genericfunctions.sendErrorMessage(command, "No songs found with that title");
                    return;
                }

                var msg = "Results for " + params + ":";
                msg += "\n```";
                for(var i=0;i<result.length;i++){
                    msg += "\n" + (i+1) + ". " +  result[i].title + " (" + result[i].duration + ")";
                }
                msg += "\n\nPick a song using '" + require('../../../../settings.js').command_prefix + "music_pick <1-x>'.";
                msg += "\n```";
                genericfunctions.sendMessage(command, msg).then(original_message=>{
                    genericfunctions.deleteMessage(command.getMessage());
                    var pickerlistitem = getPickerListItem(serverid);
                    /*if(pickerlistitem!==null){
                        pickerlistitem.emitter.removeAllListeners();
                        genericfunctions.deleteMessage(pickerlistitem.original_message);
                        pickerlistitem.original_message = null;
                    }*/
                    var em = new emitter();
                    em.on('picked', (curcommand, song, prev_message)=>{
                        //ADD PICKED SONG TO PLAYLIST
                        genericfunctions.deleteMessage(prev_message);
                        if(song.liveBroadcastContent !== "none"){
                            //SONG IS LIVESTREAM, GIVES ERROR WHEN TRYING TO PLAY WHICH CANNOT BE CATCHED (YTDL)
                            genericfunctions.sendErrorMessage(curcommand, "I can't play livestreams, try playing another song.");
                            return;
                        }
                        try{
                            playlist.add(serverid, song, position);
                            genericfunctions.sendErrorMessage(curcommand, "Added song to playlist.");
                        }catch(err){
                            genericfunctions.sendErrorMessage(curcommand, err.message);
                        }
                        return;
                    });
                    addPickerListItem(serverid, em, result, original_message);
                }).catch(console.error);;
            });
        }
    }
};