var genericfunctions = require('../GenericFunctions.js');
var playlist = require('../Playlist.js');
var yt_api = require('../YT_api.js');
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
        var url = null;
        var search = null;
        var position = null;

        var serverid = command.getMessage().guild.id.toString();
        var params = command.getParameters();

        if(serverid===undefined || serverid===null || serverid.length===0){
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        for(var i=0;i<params.length;i++){
            switch(params[i].key.toLowerCase()){
                case "url":
                    url = params[i].value;
                    break;
                case "search":
                    search = params[i].value;
                    break;
                case "position":
                    position = Number(params[i].value);
                    if(isNaN(position)){
                        genericfunctions.sendErrorMessage(command, "Position must be a number.");
                        return;
                    }
                    break;
            }
        }

        if((url===null && search===null) || (url!==null && search!==null)){
            genericfunctions.sendErrorMessage(command, "You must include -url OR -search in the command '" + require('../../../settings.js').command_prefix + "music_add'.");
            return;
        }

        //METHOD = URL
        if(url !== null){
            yt_api.getInfo(url).on('ready', (song, err)=>{
                if(err){
                    //URL INCORRECT
                    genericfunctions.sendErrorMessage(command, "Provided url was incorrect, please use YouTube urls of songs.");
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
        if(search !== null){
            yt_api.getSearchResults(search).on('ready', result=>{
                if(result === null || result.length === 0){
                    genericfunctions.sendErrorMessage(command, "No songs found with that title");
                    return;
                }

                var msg = "Results for " + search + ":";
                msg += "\n```";
                for(var i=0;i<result.length;i++){
                    msg += "\n" + (i+1) + ". " +  result[i].title + " (" + result[i].duration + ")";
                }
                msg += "\n\nPick a song using '" + require('../../../settings.js').command_prefix + "music_pick -num [1-x]'.";
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